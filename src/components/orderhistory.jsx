import { useState } from "react";

const STATUS_META = {
  new:       { label: "Order Received", icon: "📋", color: "#F97316", bg: "rgba(249,115,22,0.1)" },
  confirmed: { label: "Confirmed",      icon: "✅", color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
  preparing: { label: "Preparing",      icon: "👨‍🍳", color: "#2563eb", bg: "rgba(37,99,235,0.1)" },
  ready:     { label: "Ready!",         icon: "🎉", color: "#D0161B", bg: "rgba(208,22,27,0.1)" },
  delivered: { label: "Delivered",      icon: "📦", color: "#555",    bg: "rgba(0,0,0,0.05)" },
  cancelled: { label: "Cancelled",      icon: "❌", color: "#D0161B", bg: "rgba(208,22,27,0.07)" },
};

const STEPS = ["new","confirmed","preparing","ready","delivered"];

function StatusBar({ status }) {
  const currentIdx = STEPS.indexOf(status);
  if (status === "cancelled") return (
    <div style={{ padding: "0.5rem 0.8rem", background: "rgba(208,22,27,0.08)", borderRadius: "0.4rem", color: "#D0161B", fontSize: "0.78rem", fontWeight: 700, textAlign: "center" }}>
      ❌ Order Cancelled
    </div>
  );
  return (
    <div style={{ padding: "0.8rem", background: "#FFF7ED", borderRadius: "0.6rem", border: "1px solid rgba(249,115,22,0.15)", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
        <div style={{ position: "absolute", top: 12, left: "10%", right: "10%", height: 2, background: "rgba(249,115,22,0.12)" }} />
        <div style={{ position: "absolute", top: 12, left: "10%", height: 2, background: "#F97316", width: `${currentIdx <= 0 ? 0 : Math.min(currentIdx / 4, 1) * 80}%`, transition: "width 0.5s" }} />
        {STEPS.map((s, i) => {
          const m = STATUS_META[s];
          const done = i <= currentIdx;
          return (
            <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", zIndex: 2, flex: 1 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: done ? "#F97316" : "#fff",
                border: `2px solid ${done ? "#F97316" : "rgba(249,115,22,0.2)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem",
                boxShadow: i === currentIdx ? "0 0 10px rgba(249,115,22,0.5)" : "none",
              }}>{m.icon}</div>
              <span style={{ fontSize: "0.55rem", fontWeight: 700, color: done ? "#92400e" : "#ccc", textAlign: "center", letterSpacing: "0.03em" }}>
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrderHistory({ orders, onClose }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2500,
      background: "rgba(28,10,0,0.5)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
    }} onClick={e => e.target === e.currentTarget && onClose()}>

      <div style={{
        background: "#FFFBF5", borderRadius: "1.2rem",
        border: "2px solid rgba(249,115,22,0.25)",
        width: "100%", maxWidth: 560, maxHeight: "88vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 30px 80px rgba(249,115,22,0.18)",
        animation: "histPop 0.25s ease",
      }}>
        <style>{`@keyframes histPop{from{transform:scale(0.94) translateY(16px);opacity:0}to{transform:none;opacity:1}}`}</style>

        {/* Header */}
        <div style={{
          padding: "1.4rem 1.8rem 1.1rem",
          borderBottom: "1px solid rgba(249,115,22,0.15)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#FFF7ED", borderRadius: "1.1rem 1.1rem 0 0",
        }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.9rem", letterSpacing: "0.08em", color: "#1c0a00" }}>
              ORDER HISTORY
            </div>
            <div style={{ fontSize: "0.72rem", color: "#92400e", fontWeight: 600 }}>
              {orders.length} order{orders.length !== 1 ? "s" : ""} placed this session
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)",
            color: "#92400e", fontSize: "1.1rem", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
          }}>✕</button>
        </div>

        {/* Orders list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem" }}>
          {orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#92400e", fontFamily: "'Barlow',sans-serif" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍽</div>
              <strong>No orders yet!</strong><br/>
              <span style={{ color: "#a16207", fontSize: "0.85rem" }}>Place your first order from the menu.</span>
            </div>
          ) : (
            [...orders].reverse().map((order, i) => {
              const isOpen = expanded === i;
              const sm = STATUS_META[order.status] || STATUS_META.new;
              return (
                <div key={i} style={{
                  background: "#fff", border: "1.5px solid rgba(249,115,22,0.15)",
                  borderRadius: "0.8rem", marginBottom: "0.9rem",
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(249,115,22,0.07)",
                  transition: "box-shadow 0.2s",
                }}>
                  {/* Order header row */}
                  <div
                    onClick={() => setExpanded(isOpen ? null : i)}
                    style={{
                      padding: "0.9rem 1.1rem",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      cursor: "pointer",
                      background: isOpen ? "#FFF7ED" : "#fff",
                      borderBottom: isOpen ? "1px solid rgba(249,115,22,0.12)" : "none",
                      transition: "background 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{
                        fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.1rem",
                        letterSpacing: "0.08em", color: "#1c0a00",
                      }}>{order.orderNumber}</div>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                        background: sm.bg, color: sm.color,
                        fontSize: "0.62rem", fontWeight: 800,
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        padding: "0.2rem 0.6rem", borderRadius: "2rem",
                        border: `1px solid ${sm.color}44`,
                      }}>
                        {sm.icon} {sm.label}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                      <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.2rem", color: "#D0161B" }}>
                        ₹{order.totalAmount}
                      </span>
                      <span style={{ color: "#92400e", fontSize: "0.85rem", transition: "transform 0.2s", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isOpen && (
                    <div style={{ padding: "1rem 1.1rem" }}>
                      {/* Tracking bar */}
                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em", color: "#92400e", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                          Order Status
                        </div>
                        <StatusBar status={order.status || "new"} />
                      </div>

                      {/* Customer info */}
                      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.8rem", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 140, padding: "0.6rem 0.8rem", background: "#FFF7ED", borderRadius: "0.5rem", border: "1px solid rgba(249,115,22,0.12)" }}>
                          <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>Customer</div>
                          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1c0a00" }}>{order.customer?.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "#92400e" }}>{order.customer?.phone}</div>
                        </div>
                        <div style={{ flex: 1, minWidth: 140, padding: "0.6rem 0.8rem", background: "#FFF7ED", borderRadius: "0.5rem", border: "1px solid rgba(249,115,22,0.12)" }}>
                          <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>Type</div>
                          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1c0a00", textTransform: "capitalize" }}>
                            {order.customer?.type === "dine-in" ? "🍽 Dine In" : order.customer?.type === "takeaway" ? "🥡 Takeaway" : "🛵 Delivery"}
                          </div>
                          {order.customer?.address && (
                            <div style={{ fontSize: "0.72rem", color: "#92400e", marginTop: "0.2rem" }}>{order.customer.address}</div>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em", color: "#92400e", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                        Items Ordered
                      </div>
                      {order.items?.map((item, j) => (
                        <div key={j} style={{
                          display: "flex", justifyContent: "space-between",
                          padding: "0.45rem 0",
                          borderBottom: j < order.items.length - 1 ? "1px dashed rgba(249,115,22,0.12)" : "none",
                          fontFamily: "'Barlow',sans-serif", fontSize: "0.82rem",
                        }}>
                          <span style={{ color: "#1c0a00" }}>
                            <strong style={{ color: "#92400e" }}>{item.qty}×</strong> {item.name}
                            <span style={{ color: "#a16207", fontSize: "0.72rem" }}> ({item.variant})</span>
                          </span>
                          <span style={{ color: "#D0161B", fontWeight: 700 }}>₹{item.price * item.qty}</span>
                        </div>
                      ))}

                      {order.notes && (
                        <div style={{ marginTop: "0.6rem", padding: "0.5rem 0.7rem", background: "#FFF7ED", borderRadius: "0.4rem", fontSize: "0.75rem", color: "#78350f" }}>
                          💬 {order.notes}
                        </div>
                      )}

                      {/* Total */}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.8rem", paddingTop: "0.8rem", borderTop: "1.5px solid rgba(249,115,22,0.15)" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.88rem", color: "#1c0a00" }}>Total Paid</span>
                        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.4rem", color: "#D0161B" }}>₹{order.totalAmount}</span>
                      </div>

                      {/* Placed at */}
                      <div style={{ marginTop: "0.4rem", fontSize: "0.68rem", color: "#a16207", textAlign: "right" }}>
                        Placed at {new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid rgba(249,115,22,0.12)", background: "#FFF7ED", borderRadius: "0 0 1.1rem 1.1rem" }}>
          <button onClick={onClose} style={{
            width: "100%", background: "#F97316", color: "#fff", border: "none",
            borderRadius: "0.4rem", padding: "0.85rem",
            fontFamily: "'Barlow',sans-serif", fontWeight: 800,
            fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase",
            cursor: "pointer", boxShadow: "0 4px 16px rgba(249,115,22,0.3)",
          }}>Close</button>
        </div>
      </div>
    </div>
  );
}