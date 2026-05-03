import express from "express";
import crypto from "crypto";
import Order from "../models/Order.js";

const router = express.Router();

const CF_BASE = () =>
  process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

const cfHeaders = () => ({
  "x-client-id":     process.env.CASHFREE_APP_ID,
  "x-client-secret": process.env.CASHFREE_SECRET_KEY,
  "x-api-version":   "2023-08-01",
  "Content-Type":    "application/json",
});

// POST /api/payment/create-session
// Called by frontend before opening Cashfree checkout
router.post("/create-session", async (req, res) => {
  try {
    const { amount, customerName, customerPhone, customerEmail } = req.body;

    if (!process.env.CASHFREE_APP_ID || process.env.CASHFREE_APP_ID === "YOUR_APP_ID_HERE") {
      return res.status(503).json({ error: "Cashfree credentials not configured. Add them to backend/.env" });
    }

    // Sanitise phone to 10 digits (Cashfree requires exactly 10)
    const phone = String(customerPhone || "").replace(/\D/g, "").slice(-10).padStart(10, "0");
    const cfOrderId = "ZNG-" + Date.now();

    const response = await fetch(`${CF_BASE()}/orders`, {
      method: "POST",
      headers: cfHeaders(),
      body: JSON.stringify({
        order_id:       cfOrderId,
        order_amount:   amount,
        order_currency: "INR",
        customer_details: {
          customer_id:    "cust_" + Date.now(),
          customer_name:  customerName || "Customer",
          customer_email: customerEmail || "orders@zangos.in",
          customer_phone: phone,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || JSON.stringify(data));

    res.json({
      sessionId:  data.payment_session_id,
      cfOrderId:  data.order_id,
    });
  } catch (err) {
    console.error("Cashfree create-session error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payment/webhook  (Cashfree calls this after payment)
// Register this URL in your Cashfree dashboard → Webhooks
router.post("/webhook", express.raw({ type: "*/*" }), async (req, res) => {
  try {
    const rawBody  = req.body.toString();
    const sig      = req.headers["x-webhook-signature"];
    const timestamp= req.headers["x-webhook-timestamp"];

    // Signature verification
    if (sig && timestamp && process.env.CASHFREE_SECRET_KEY) {
      const message  = timestamp + rawBody;
      const expected = crypto
        .createHmac("sha256", process.env.CASHFREE_SECRET_KEY)
        .update(message)
        .digest("base64");
      if (sig !== expected) {
        console.warn("Cashfree webhook: invalid signature");
        return res.status(401).json({ error: "Invalid signature" });
      }
    }

    const event = JSON.parse(rawBody);
    const type  = event.type;
    console.log("Cashfree webhook event:", type);

    if (type === "PAYMENT_SUCCESS_WEBHOOK") {
      const cfOrderId = event.data?.order?.order_id;
      const paymentId = String(event.data?.payment?.cf_payment_id || "");

      const order = await Order.findOneAndUpdate(
        { cfOrderId },
        { paymentStatus: "paid", paymentId },
        { new: true }
      );

      if (order) {
        // Notify admin dashboard in real-time
        req.app.get("io")?.emit("order_updated", {
          orderId:       order._id,
          orderNumber:   order.orderNumber,
          status:        order.status,
          paymentStatus: "paid",
        });
        console.log(`✅ Payment confirmed for order ${order.orderNumber}`);
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/payment/verify/:cfOrderId  — manual status check fallback
router.get("/verify/:cfOrderId", async (req, res) => {
  try {
    const response = await fetch(
      `${CF_BASE()}/orders/${req.params.cfOrderId}/payments`,
      { headers: cfHeaders() }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
