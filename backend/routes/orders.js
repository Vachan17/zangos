import express from "express";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";

const router = express.Router();

// Middleware to optionally get user from token
const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
    }
  } catch {}
  next();
};

// POST /api/orders — place order
router.post("/", optionalAuth, async (req, res) => {
  try {
    const { customer, items, totalAmount, notes, paymentStatus, paymentId, upiTxnId } = req.body;
    if (!customer?.name || !customer?.phone || !items?.length)
      return res.status(400).json({ error: "Missing required fields" });

    const order = await new Order({
      customer, items, totalAmount, notes, paymentStatus, paymentId, upiTxnId,
      userId: req.userId || null,
    }).save();

    // Real-time notify employee dashboard
    req.app.get("io")?.to("employees").emit("new_order", {
      orderId: order._id, orderNumber: order.orderNumber,
      customer: order.customer, items: order.items,
      totalAmount: order.totalAmount, notes: order.notes,
      status: order.status, createdAt: order.createdAt,
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders — all orders (employee)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/my — orders for logged-in user
router.get("/my", optionalAuth, async (req, res) => {
  try {
    if (!req.userId) return res.json([]);
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/orders/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    req.app.get("io")?.emit("order_updated", { orderId: order._id, orderNumber: order.orderNumber, status: order.status });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/orders/:id/payment — mark payment as paid
router.patch("/:id/payment", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "paid" },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    req.app.get("io")?.emit("order_updated", { orderId: order._id, orderNumber: order.orderNumber, status: order.status, paymentStatus: "paid" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;