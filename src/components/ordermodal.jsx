import { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { API_BASE } from "../config";

const CF_MODE = "sandbox"; // change to "production" when you go live

export default function OrderModal({ cart, onClose, onSuccess, user }) {
  const [step,      setStep]      = useState("details"); // "details" | "payment"
  const [name,      setName]      = useState(user?.name  || "");
  const [phone,     setPhone]     = useState(user?.phone || "");
  const [email,     setEmail]     = useState(user?.email || "");
  const [address,   setAddress]   = useState("");
  const [type,      setType]      = useState("dine-in");
  const [notes,     setNotes]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [payLoading,setPayLoading]= useState(false);
  const [error,     setError]     = useState("");
  const [focused,   setFocused]   = useState("");

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const inp = (field) => ({
    width: "100%", padding: "0.8rem 1rem",
    background: "#FFF7ED",
    border: `1.5px solid ${focused === field ? "#F97316" : "rgba(249,115,22,0.25)"}`,
    borderRadius: "0.4rem", color: "#1c0a00",
    fontFamily: "'Barlow',sans-serif", fontSize: "0.92rem",
    outline: "none", transition: "border-color 0.2s",
  });

  const goToPayment = () => {
    if (!name.trim())  { setError("Please enter your name."); return; }
    if (!phone.trim()) { setError("Please enter your phone number."); return; }
    if (type === "delivery" && !address.trim()) { setError("Please enter your delivery address."); return; }
    setError("");
    setStep("payment");
  };

  // Place the order in the DB after payment success
  const placeOrder = async (cfOrderId, paymentId) => {
    setLoading(true);
    const orderPayload = {
      customer: { name, phone, address, type },
      items: cart.map(i => ({ name: i.name, variant: i.variant, price: i.price, qty: i.qty })),
      totalAmount: total,
      notes,
      paymentStatus: "paid",
      paymentId: String(paymentId || ""),
      cfOrderId: cfOrderId || "",
    };
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("zangos_token") ? { Authorization: `Bearer ${localStorage.getItem("zangos_token")}` } : {}),
        },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      onSuccess(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    setPayLoading(true);
    setError("");
    try {
      // 1. Create Cashfree session on backend
      const sessionRes = await fetch(`${API_BASE}/api/payment/create-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerName: name,
          customerPhone: phone,
          customerEmail: email || "orders@zangos.in",
        }),
      });
      const sessionData = await sessionRes.json();
      if (!sessionRes.ok) throw new Error(sessionData.error || "Could not create payment session");

      const { sessionId, cfOrderId } = sessionData;

      // 2. Open Cashfree checkout
      const cashfree = await load({ mode: CF_MODE });
      const result = await cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed");
      }

      if (result.paymentDetails) {
        // Payment success — place the order
        await placeOrder(cfOrderId, result.paymentDetails.paymentMessage);
      } else if (result.redirect) {
        // Some payment methods redirect (e.g. netbanking)
        // We'll verify on return — for now place order as pending
        await placeOrder(cfOrderId, "redirect");
      }

    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setPayLoading(false);
    }
  };

  const TYPE_OPTIONS = [
    { value: "dine-in",  label: "🍽 DINE IN" },
    { value: "takeaway", label: "🥡 TAKEAWAY" },
    { value: "delivery", label: "🛵 DELIVERY" },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 3000,
      background: "rgba(28,10,0,0.55)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
    }} onClick={e => e.target === e.currentTarget && onClose()}>

      <div style={{
        background: "#FFFBF5", border: "2px solid rgba(249,115,22,0.3)",
        borderRadius: "1.2rem", width: "100%", maxWidth: 500,
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 30px 80px rgba(249,115,22,0.2)",
        animation: "modalPop 0.25s ease",
      }}>
        <style>{`
          @keyframes modalPop { from{transform:scale(0.93) translateY(16px);opacity:0} to{transform:none;opacity:1} }
          input::placeholder, textarea::placeholder { color: #c4a35a; }
        `}</style>

        {/* Header */}
        <div style={{
          padding: "1.4rem 1.8rem 1.1rem",
          borderBottom: "1px solid rgba(249,115,22,0.15)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#FFF7ED", borderRadius: "1.1rem 1.1rem 0 0",
        }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.9rem", letterSpacing: "0.08em", color: "#1c0a00" }}>
              {step === "details" ? "CHECKOUT" : "PAYMENT"}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#92400e", fontWeight: 600 }}>
              {cart.length} item{cart.length !== 1 ? "s" : ""} · Total ₹{total}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)",
            color: "#92400e", fontSize: "1.1rem", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
          }}>✕</button>
        </div>

        {/* ── STEP 1: Details ── */}
        {step === "details" && (
          <div style={{ padding: "1.5rem 1.8rem" }}>
            {/* Order Type */}
            <div style={{ marginBottom: "1.4rem" }}>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", color: "#92400e", textTransform: "uppercase", marginBottom: "0.6rem" }}>Order Type</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {TYPE_OPTIONS.map(({ value, label }) => (
                  <button key={value} onClick={() => setType(value)} style={{
                    flex: 1, padding: "0.65rem 0.3rem",
                    background: type === value ? "#F97316" : "#FFF7ED",
                    border: `1.5px solid ${type === value ? "#F97316" : "rgba(249,115,22,0.3)"}`,
                    borderRadius: "0.4rem",
                    color: type === value ? "#fff" : "#92400e",
                    fontFamily: "'Barlow',sans-serif", fontWeight: 800,
                    fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase",
                    cursor: "pointer", transition: "all 0.2s",
                    boxShadow: type === value ? "0 4px 12px rgba(249,115,22,0.3)" : "none",
                  }}>{label}</button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", color: "#92400e", textTransform: "uppercase", marginBottom: "0.4rem" }}>Your Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Arjun Sharma"
                onFocus={() => setFocused("name")} onBlur={() => setFocused("")} style={inp("name")} />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", color: "#92400e", textTransform: "uppercase", marginBottom: "0.4rem" }}>Phone Number *</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
                onFocus={() => setFocused("phone")} onBlur={() => setFocused("")} style={inp("phone")} />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", color: "#92400e", textTransform: "uppercase", marginBottom: "0.4rem" }}>Email (optional)</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="for payment receipt"
                type="email" onFocus={() => setFocused("email")} onBlur={() => setFocused("")} style={inp("email")} />
            </div>

            {/* Address (delivery only) */}
            {type === "delivery" && (
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", color: "#92400e", textTransform: "uppercase", marginBottom: "0.4rem" }}>Delivery Address *</label>
                <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Full address with landmark..." rows={3}
                  onFocus={() => setFocused("address")} onBlur={() => setFocused("")} style={{ ...inp("address"), resize: "vertical" }} />
              </div>
            )}

            {/* Notes */}
            <div style={{ marginBottom: "1.4rem" }}>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", color: "#92400e", textTransform: "uppercase", marginBottom: "0.4rem" }}>Special Instructions (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Extra spicy? No onions?" rows={2}
                onFocus={() => setFocused("notes")} onBlur={() => setFocused("")} style={{ ...inp("notes"), resize: "vertical" }} />
            </div>

            {/* Order Summary */}
            <div style={{ padding: "1rem", marginBottom: "1.2rem", background: "#FFF7ED", border: "1.5px solid rgba(249,115,22,0.2)", borderRadius: "0.6rem" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em", color: "#92400e", textTransform: "uppercase", marginBottom: "0.7rem" }}>Order Summary</div>
              {cart.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#1c0a00", marginBottom: "0.3rem" }}>
                  <span>{item.name} ({item.variant}) × {item.qty}</span>
                  <span style={{ color: "#D0161B", fontWeight: 700 }}>₹{item.price * item.qty}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.7rem", paddingTop: "0.7rem", borderTop: "1px solid rgba(249,115,22,0.15)" }}>
                <span style={{ fontWeight: 800, fontSize: "0.88rem", color: "#1c0a00" }}>Total</span>
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.5rem", color: "#D0161B" }}>₹{total}</span>
              </div>
            </div>

            {error && <div style={{ padding: "0.7rem 1rem", marginBottom: "1rem", background: "rgba(208,22,27,0.07)", border: "1px solid rgba(208,22,27,0.25)", borderRadius: "0.4rem", color: "#D0161B", fontSize: "0.82rem", fontWeight: 600 }}>⚠ {error}</div>}

            <button onClick={goToPayment} style={{
              width: "100%", background: "linear-gradient(135deg,#D0161B,#F97316)",
              color: "#fff", border: "none", borderRadius: "0.4rem", padding: "1rem",
              fontFamily: "'Barlow',sans-serif", fontWeight: 800,
              fontSize: "0.92rem", letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: "pointer", boxShadow: "0 8px 24px rgba(208,22,27,0.35)",
            }}>Continue to Payment →</button>
          </div>
        )}

        {/* ── STEP 2: Cashfree Payment ── */}
        {step === "payment" && (
          <div style={{ padding: "1.5rem 1.8rem" }}>
            {/* Amount card */}
            <div style={{
              textAlign: "center", padding: "1.5rem",
              background: "linear-gradient(135deg, rgba(208,22,27,0.06), rgba(249,115,22,0.06))",
              border: "1.5px solid rgba(249,115,22,0.2)", borderRadius: "1rem",
              marginBottom: "1.5rem",
            }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.15em", color: "#92400e", textTransform: "uppercase", marginBottom: "0.4rem" }}>Amount to Pay</div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "3rem", color: "#D0161B", lineHeight: 1 }}>₹{total}</div>
              <div style={{ fontSize: "0.75rem", color: "#92400e", marginTop: "0.4rem" }}>
                {name} · {phone}
              </div>
            </div>

            {/* What you can pay with */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em", color: "#92400e", textTransform: "uppercase", marginBottom: "0.8rem" }}>Pay With</div>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                {["📱 UPI", "💳 Cards", "🏦 Net Banking", "💰 Wallets"].map(m => (
                  <span key={m} style={{
                    padding: "0.4rem 0.9rem", borderRadius: "2rem",
                    background: "#FFF7ED", border: "1px solid rgba(249,115,22,0.25)",
                    fontSize: "0.75rem", fontWeight: 700, color: "#92400e",
                  }}>{m}</span>
                ))}
              </div>
            </div>

            {/* Order summary mini */}
            <div style={{ padding: "0.8rem 1rem", background: "#FFF7ED", borderRadius: "0.6rem", border: "1px solid rgba(249,115,22,0.15)", marginBottom: "1.2rem" }}>
              {cart.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#1c0a00", padding: "0.2rem 0" }}>
                  <span>{item.name} × {item.qty}</span>
                  <span style={{ color: "#D0161B", fontWeight: 700 }}>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            {error && <div style={{ padding: "0.7rem 1rem", marginBottom: "1rem", background: "rgba(208,22,27,0.07)", border: "1px solid rgba(208,22,27,0.25)", borderRadius: "0.4rem", color: "#D0161B", fontSize: "0.82rem", fontWeight: 600 }}>⚠ {error}</div>}

            {loading && (
              <div style={{ textAlign: "center", padding: "1rem", color: "#92400e", fontSize: "0.85rem", fontWeight: 600 }}>
                🔄 Placing your order...
              </div>
            )}

            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button onClick={() => { setStep("details"); setError(""); }} style={{
                flex: "0 0 auto", background: "transparent",
                border: "1.5px solid rgba(249,115,22,0.3)", color: "#92400e",
                borderRadius: "0.4rem", padding: "1rem 1.2rem",
                fontFamily: "'Barlow',sans-serif", fontWeight: 800,
                fontSize: "0.85rem", cursor: "pointer",
              }}>← Back</button>

              <button onClick={handlePay} disabled={payLoading || loading} style={{
                flex: 1,
                background: payLoading || loading
                  ? "#ccc"
                  : "linear-gradient(135deg,#D0161B,#F97316)",
                color: "#fff", border: "none", borderRadius: "0.4rem", padding: "1rem",
                fontFamily: "'Barlow',sans-serif", fontWeight: 800,
                fontSize: "0.92rem", letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: payLoading || loading ? "not-allowed" : "pointer",
                boxShadow: payLoading || loading ? "none" : "0 8px 24px rgba(208,22,27,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              }}>
                {payLoading ? "Opening Payment..." : loading ? "Placing Order..." : `Pay ₹${total} Securely →`}
              </button>
            </div>

            <div style={{ marginTop: "1rem", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.7rem", color: "#a16207" }}>🔒 Secured by</span>
              <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6366F1" }}>Cashfree Payments</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}