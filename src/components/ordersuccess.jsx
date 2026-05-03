export default function OrderSuccess({ order, onClose }) {
  const STATUS_STEPS = [
    { key: "new",       icon: "📋", label: "Order Received" },
    { key: "confirmed", icon: "✅", label: "Confirmed" },
    { key: "preparing", icon: "👨‍🍳", label: "Preparing" },
    { key: "ready",     icon: "🎉", label: "Ready!" },
  ];
  const currentIdx = STATUS_STEPS.findIndex(s => s.key === (order.status || "new"));

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 3000,
      background: "rgba(28,10,0,0.6)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
    }}>
      <div style={{
        background: "#FFFBF5", border: "2px solid rgba(249,115,22,0.3)",
        borderRadius: "1.2rem", width: "100%", maxWidth: 440,
        padding: "2rem 1.8rem", textAlign: "center",
        boxShadow: "0 30px 80px rgba(249,115,22,0.2)",
        animation: "successPop 0.3s ease",
      }}>
        <style>{`@keyframes successPop{from{transform:scale(0.85);opacity:0}to{transform:none;opacity:1}}`}</style>

        {/* Checkmark */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "rgba(249,115,22,0.1)", border: "2px solid #F97316",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem", margin: "0 auto 1.2rem",
          boxShadow: "0 0 28px rgba(249,115,22,0.25)",
        }}>✓</div>

        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2rem", letterSpacing: "0.08em", color: "#1c0a00", marginBottom: "0.5rem" }}>
          ORDER PLACED!
        </div>

        <div style={{
          display: "inline-block", background: "#D0161B", color: "#fff",
          fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.2rem", letterSpacing: "0.1em",
          padding: "0.3rem 1.2rem", borderRadius: "2rem", marginBottom: "1rem",
          boxShadow: "0 4px 14px rgba(208,22,27,0.3)",
        }}>{order.orderNumber}</div>

        <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: "0.9rem", color: "#78350f", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          Hey <strong>{order.customer?.name}</strong>! Your order is with our kitchen 🔥<br/>
          We'll call <strong>{order.customer?.phone}</strong> to confirm.
        </p>

        {/* Progress bar */}
        <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#FFF7ED", borderRadius: "0.8rem", border: "1px solid rgba(249,115,22,0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
            {/* connecting line */}
            <div style={{ position: "absolute", top: 14, left: "12%", right: "12%", height: 2, background: "rgba(249,115,22,0.15)", zIndex: 0 }} />
            <div style={{ position: "absolute", top: 14, left: "12%", height: 2, zIndex: 1, background: "#F97316", transition: "width 0.5s", width: `${currentIdx === 0 ? 0 : currentIdx >= 3 ? 76 : (currentIdx / 3) * 76}%` }} />

            {STATUS_STEPS.map((step, i) => (
              <div key={step.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", zIndex: 2, flex: 1 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: i <= currentIdx ? "#F97316" : "#fff",
                  border: `2px solid ${i <= currentIdx ? "#F97316" : "rgba(249,115,22,0.25)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.9rem",
                  boxShadow: i === currentIdx ? "0 0 12px rgba(249,115,22,0.5)" : "none",
                  transition: "all 0.3s",
                }}>{step.icon}</div>
                <span style={{ fontSize: "0.6rem", fontWeight: 700, color: i <= currentIdx ? "#92400e" : "#ccc", letterSpacing: "0.05em", textAlign: "center" }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onClose} style={{
          width: "100%", background: "#F97316", color: "#fff", border: "none",
          borderRadius: "0.4rem", padding: "0.9rem",
          fontFamily: "'Barlow',sans-serif", fontWeight: 800,
          fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase",
          cursor: "pointer", boxShadow: "0 6px 20px rgba(249,115,22,0.35)",
        }}>Back to Menu</button>
      </div>
    </div>
  );
}