import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { API_BASE, SOCKET_URL } from "../config";

const STATUS_FLOW  = ["new", "confirmed", "preparing", "ready", "delivered"];
const STATUS_COLOR = {
  new:       { bg: "rgba(208,22,27,0.08)",  border: "rgba(208,22,27,0.3)",  text: "#D0161B",  label: "🆕 New",         pill: "#D0161B" },
  confirmed: { bg: "rgba(234,88,12,0.08)",  border: "rgba(234,88,12,0.3)",  text: "#EA580C",  label: "✅ Confirmed",    pill: "#EA580C" },
  preparing: { bg: "rgba(37,99,235,0.08)",  border: "rgba(37,99,235,0.3)",  text: "#2563EB",  label: "👨‍🍳 Preparing",  pill: "#2563EB" },
  ready:     { bg: "rgba(22,163,74,0.08)",  border: "rgba(22,163,74,0.3)",  text: "#16A34A",  label: "🎉 Ready",        pill: "#16A34A" },
  delivered: { bg: "rgba(100,116,139,0.06)",border: "rgba(100,116,139,0.2)",text: "#64748B",  label: "📦 Delivered",    pill: "#64748B" },
  cancelled: { bg: "rgba(220,38,38,0.05)",  border: "rgba(220,38,38,0.2)",  text: "#DC2626",  label: "❌ Cancelled",    pill: "#DC2626" },
};

const PAY_BADGE = {
  paid:        { bg: "rgba(22,163,74,0.1)",   border: "rgba(22,163,74,0.3)",   text: "#16A34A", label: "✅ Paid" },
  upi_pending: { bg: "rgba(234,179,8,0.1)",   border: "rgba(234,179,8,0.4)",   text: "#CA8A04", label: "⏳ Verify Payment" },
  pending:     { bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.2)", text: "#64748B", label: "💳 Pending" },
  failed:      { bg: "rgba(220,38,38,0.07)",   border: "rgba(220,38,38,0.25)",  text: "#DC2626", label: "❌ Failed" },
};

export default function EmployeeDashboard() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem("zangos_admin_auth") === "true");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pwFocused,     setPwFocused]     = useState(false);

  const [orders,    setOrders]    = useState([]);
  const [connected, setConnected] = useState(false);
  const [filter,    setFilter]    = useState("all");
  const [alertId,   setAlertId]   = useState(null);
  const socketRef = useRef(null);

  // --- Auth Screen ---
  if (!authenticated) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#FFFBF5",
        backgroundImage: "radial-gradient(circle at 20% 50%, rgba(208,22,27,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(249,115,22,0.08) 0%, transparent 50%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Barlow', sans-serif", padding: "1rem",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700;800&display=swap');
          @keyframes adminFadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        `}</style>
        <div style={{
          width: "100%", maxWidth: 420, background: "#fff",
          borderRadius: "1.5rem", border: "1.5px solid rgba(249,115,22,0.2)",
          boxShadow: "0 32px 80px rgba(208,22,27,0.12), 0 8px 24px rgba(0,0,0,0.06)",
          overflow: "hidden", animation: "adminFadeIn 0.4s ease",
        }}>
          <div style={{
            background: "linear-gradient(135deg, #D0161B 0%, #F97316 100%)",
            padding: "2rem 2rem 1.5rem", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.8rem", letterSpacing: "0.12em", color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.25)" }}>ZANGOS</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>Kitchen Dashboard</div>
          </div>

          <div style={{ padding: "2rem 1.8rem" }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1c0a00", marginBottom: "0.3rem" }}>Admin Access</div>
              <div style={{ fontSize: "0.82rem", color: "#92400e" }}>Enter your kitchen dashboard password</div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (passwordInput === "zangos@777") {
                sessionStorage.setItem("zangos_admin_auth", "true");
                setAuthenticated(true);
              } else {
                setPasswordError("Incorrect password. Try again.");
              }
            }}>
              <input
                type="password"
                placeholder="Enter Password"
                value={passwordInput}
                onChange={e => { setPasswordInput(e.target.value); setPasswordError(""); }}
                onFocus={() => setPwFocused(true)}
                onBlur={() => setPwFocused(false)}
                style={{
                  width: "100%", padding: "0.9rem 1rem",
                  background: "#FFF7ED",
                  border: `1.5px solid ${passwordError ? "#D0161B" : pwFocused ? "#F97316" : "rgba(249,115,22,0.25)"}`,
                  borderRadius: "0.5rem", color: "#1c0a00",
                  fontFamily: "'Barlow',sans-serif", fontSize: "0.95rem",
                  outline: "none", transition: "border-color 0.2s",
                  marginBottom: "0.5rem",
                }}
                autoFocus
              />
              {passwordError && (
                <div style={{ color: "#D0161B", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.8rem" }}>⚠ {passwordError}</div>
              )}
              <button type="submit" style={{
                width: "100%", marginTop: "0.5rem",
                background: "linear-gradient(135deg, #D0161B, #F97316)",
                color: "#fff", border: "none", borderRadius: "0.5rem",
                padding: "1rem", fontFamily: "'Barlow',sans-serif",
                fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.08em",
                cursor: "pointer", boxShadow: "0 8px 24px rgba(208,22,27,0.35)",
                transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                ACCESS DASHBOARD →
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <a href="#/" style={{ color: "#92400e", textDecoration: "none", fontSize: "0.82rem", fontWeight: 600 }}>
                ← Back to Main Site
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetch(`${API_BASE}/api/orders`)
      .then(r => r.json())
      .then(setOrders)
      .catch(console.error);
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const socket = io(SOCKET_URL ?? undefined, { transports: ["websocket"] });
    socketRef.current = socket;
    socket.on("connect", () => { setConnected(true); socket.emit("join_employee"); });
    socket.on("disconnect", () => setConnected(false));
    socket.on("new_order", (order) => {
      setOrders(prev => [order, ...prev]);
      setAlertId(order.orderId || order._id);
      try { new Audio("https://www.soundjay.com/buttons/sounds/button-09.mp3").play(); } catch (_) {}
      setTimeout(() => setAlertId(null), 4000);
    });
    socket.on("order_updated", ({ orderId, status }) => {
      setOrders(prev => prev.map(o => (o._id === orderId || o.orderId === orderId) ? { ...o, status } : o));
    });
    return () => socket.disconnect();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      socketRef.current?.emit("order_status_update", { orderId, status });
    } catch (err) { console.error(err); }
  };

  const markPaid = async (orderId) => {
    try {
      await fetch(`${API_BASE}/api/orders/${orderId}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      setOrders(prev => prev.map(o =>
        (o._id === orderId || o.orderId === orderId) ? { ...o, paymentStatus: "paid" } : o
      ));
    } catch (err) { console.error(err); }
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const newCount  = orders.filter(o => o.status === "new").length;

  const validOrders    = orders.filter(o => o.status !== "cancelled");
  const overallSale    = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const profit         = Math.round(overallSale * 0.35);
  const unitsSold      = validOrders.reduce((sum, o) => sum + o.items.reduce((acc, i) => acc + i.qty, 0), 0);
  const pendingToPrepare = orders.filter(o => o.status === "new" || o.status === "confirmed").length;
  const preparedFood   = orders.filter(o => o.status === "ready").length;

  const statCards = [
    { label: "Overall Sales", value: `₹${overallSale}`, accent: "#16A34A", icon: "💰" },
    { label: "Est. Profit (35%)", value: `₹${profit}`, accent: "#2563EB", icon: "📈" },
    { label: "Units Sold", value: unitsSold, accent: "#7C3AED", icon: "🍗" },
    { label: "Pending to Prepare", value: pendingToPrepare, accent: "#EA580C", icon: "⏳" },
    { label: "Ready to Serve", value: preparedFood, accent: "#D0161B", icon: "🎉" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F8F4F0", fontFamily: "'Barlow', sans-serif", color: "#1c0a00" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #FFF7ED; }
        ::-webkit-scrollbar-thumb { background: #F97316; border-radius: 3px; }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(208,22,27,0.4)} 50%{box-shadow:0 0 0 10px rgba(208,22,27,0)} }
        @keyframes slideDown { from{transform:translateY(-20px);opacity:0} to{transform:none;opacity:1} }
        @keyframes newOrder { 0%{box-shadow:0 0 0 0 rgba(208,22,27,0.6)} 100%{box-shadow:0 0 40px 10px rgba(208,22,27,0)} }
      `}</style>

      {/* Top Bar */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid rgba(249,115,22,0.15)",
        padding: "1rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.12em", color: "#D0161B" }}>ZANGOS</div>
          <span style={{
            background: "rgba(208,22,27,0.08)", border: "1px solid rgba(208,22,27,0.25)",
            color: "#D0161B", fontSize: "0.62rem", fontWeight: 800,
            letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "0.25rem 0.8rem", borderRadius: "2rem",
          }}>Kitchen Display</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {newCount > 0 && (
            <div style={{
              background: "#D0161B", color: "#fff",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "0.85rem", letterSpacing: "0.1em",
              padding: "0.3rem 1rem", borderRadius: "2rem",
              animation: "pulse 1.5s infinite",
            }}>
              {newCount} NEW ORDER{newCount > 1 ? "S" : ""}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: connected ? "#16A34A" : "#DC2626",
              boxShadow: connected ? "0 0 8px #16A34A" : "none",
            }} />
            <span style={{ fontSize: "0.75rem", color: connected ? "#16A34A" : "#DC2626", fontWeight: 700 }}>
              {connected ? "Live" : "Offline"}
            </span>
          </div>
          <a href="#/" style={{
            fontSize: "0.75rem", color: "#92400e", fontWeight: 700,
            textDecoration: "none", padding: "0.4rem 0.9rem",
            border: "1px solid rgba(249,115,22,0.3)", borderRadius: "2rem",
          }}>← Main Site</a>
        </div>
      </div>

      {/* New Order Alert Banner */}
      {alertId && (
        <div style={{
          background: "linear-gradient(135deg, #D0161B, #F97316)",
          padding: "0.8rem 2rem",
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 800, fontSize: "0.85rem",
          letterSpacing: "0.1em", textAlign: "center",
          animation: "slideDown 0.3s ease", color: "#fff",
        }}>
          🔔 NEW ORDER JUST CAME IN — CHECK BELOW!
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ padding: "1.5rem 2rem 0.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {statCards.map(({ label, value, accent, icon }) => (
          <div key={label} style={{
            background: "#fff", padding: "1.2rem 1.5rem",
            borderRadius: "1rem", border: "1px solid rgba(249,115,22,0.12)",
            borderLeft: `4px solid ${accent}`,
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.1rem" }}>{icon}</span>
              <span style={{ fontSize: "0.65rem", color: "#92400e", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 }}>{label}</span>
            </div>
            <div style={{ fontSize: "2rem", color: "#1c0a00", fontFamily: "'Bebas Neue', sans-serif", lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ padding: "1.2rem 2rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", borderBottom: "1px solid rgba(249,115,22,0.12)" }}>
        {["all", "new", "confirmed", "preparing", "ready", "delivered"].map(s => {
          const count = s === "all" ? orders.length : orders.filter(o => o.status === s).length;
          const sc    = STATUS_COLOR[s];
          const active = filter === s;
          return (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "0.5rem 1.1rem",
              background: active ? (s === "all" ? "#D0161B" : sc?.pill) : "#fff",
              border: `1.5px solid ${active ? (s === "all" ? "#D0161B" : sc?.pill) : "rgba(249,115,22,0.2)"}`,
              borderRadius: "2rem",
              color: active ? "#fff" : (s === "all" ? "#1c0a00" : sc?.text || "#1c0a00"),
              fontFamily: "'Barlow', sans-serif", fontWeight: 800,
              fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: active ? "0 4px 12px rgba(208,22,27,0.2)" : "none",
            }}>
              {s === "all" ? "All" : sc?.label || s} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Grid */}
      <div style={{ padding: "1.5rem 2rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.2rem" }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "5rem", color: "#92400e", fontSize: "1rem" }}>
            No orders yet. Waiting for customers... 🔥
          </div>
        ) : (
          filtered.map(order => {
            const sc     = STATUS_COLOR[order.status] || STATUS_COLOR.new;
            const isNew  = alertId === (order._id || order.orderId);
            const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1];

            return (
              <div key={order._id || order.orderId} style={{
                background: "#fff",
                border: `1.5px solid ${isNew ? "#D0161B" : sc.border}`,
                borderRadius: "1rem",
                overflow: "hidden",
                boxShadow: isNew ? "0 0 30px rgba(208,22,27,0.2)" : "0 4px 16px rgba(0,0,0,0.07)",
                animation: isNew ? "newOrder 0.6s ease-out" : "none",
                transition: "box-shadow 0.3s",
              }}>
                {/* Card Header */}
                <div style={{
                  background: sc.bg,
                  borderBottom: `1px solid ${sc.border}`,
                  padding: "0.85rem 1.1rem",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.1em", color: "#1c0a00" }}>
                      {order.orderNumber || "—"}
                    </span>
                    <span style={{
                      fontSize: "0.62rem", fontWeight: 800, color: sc.text,
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      background: "#fff", padding: "0.15rem 0.55rem", borderRadius: "2rem",
                      border: `1px solid ${sc.border}`,
                    }}>
                      {sc.label}
                    </span>
                    {/* Payment badge */}
                    {(() => {
                      const pb = PAY_BADGE[order.paymentStatus] || PAY_BADGE.pending;
                      return (
                        <span style={{
                          fontSize: "0.6rem", fontWeight: 800,
                          color: pb.text, background: pb.bg,
                          border: `1px solid ${pb.border}`,
                          padding: "0.15rem 0.55rem", borderRadius: "2rem",
                          letterSpacing: "0.06em", textTransform: "uppercase",
                        }}>{pb.label}</span>
                      );
                    })()}
                  </div>
                  <span style={{ fontSize: "0.68rem", color: "#92400e", fontWeight: 600 }}>
                    {new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {/* Customer Info */}
                <div style={{ padding: "0.9rem 1.1rem 0.6rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.3rem" }}>
                    <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#1c0a00" }}>{order.customer?.name}</span>
                    <span style={{
                      fontSize: "0.6rem", fontWeight: 800,
                      background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)",
                      color: "#EA580C", padding: "0.1rem 0.5rem", borderRadius: "2rem",
                      textTransform: "uppercase", letterSpacing: "0.08em",
                    }}>
                      {order.customer?.type || "dine-in"}
                    </span>
                  </div>
                  <a href={`tel:${order.customer?.phone}`} style={{ fontSize: "0.82rem", color: "#D0161B", textDecoration: "none", fontWeight: 700 }}>
                    📞 {order.customer?.phone}
                  </a>
                  {order.customer?.address && (
                    <div style={{ fontSize: "0.75rem", color: "#92400e", marginTop: "0.3rem" }}>📍 {order.customer.address}</div>
                  )}
                </div>

                {/* Items */}
                <div style={{ padding: "0 1.1rem 0.8rem", borderBottom: "1px solid rgba(249,115,22,0.1)" }}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between",
                      fontSize: "0.82rem", color: "#444",
                      padding: "0.3rem 0",
                      borderBottom: i < order.items.length - 1 ? "1px dashed rgba(249,115,22,0.15)" : "none",
                    }}>
                      <span>
                        <span style={{ fontWeight: 800, color: "#1c0a00" }}>{item.qty}×</span>{" "}
                        {item.name} <span style={{ color: "#92400e" }}>({item.variant})</span>
                      </span>
                      <span style={{ color: "#D0161B", fontWeight: 700 }}>₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                {/* UPI Transaction ID */}
                {order.upiTxnId && (
                  <div style={{
                    padding: "0.5rem 1.1rem",
                    background: order.paymentStatus === "upi_pending" ? "rgba(234,179,8,0.08)" : "rgba(22,163,74,0.06)",
                    borderBottom: "1px solid rgba(249,115,22,0.1)",
                    display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap",
                  }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#92400e" }}>UPI Ref:</span>
                    <code style={{ fontSize: "0.75rem", color: "#1c0a00", fontWeight: 700, background: "#fff", padding: "0.1rem 0.5rem", borderRadius: "0.3rem", border: "1px solid rgba(249,115,22,0.2)" }}>
                      {order.upiTxnId}
                    </code>
                    {order.paymentStatus === "upi_pending" && (
                      <button
                        onClick={() => markPaid(order._id || order.orderId)}
                        style={{
                          marginLeft: "auto",
                          background: "#16A34A", color: "#fff", border: "none",
                          borderRadius: "0.3rem", padding: "0.3rem 0.8rem",
                          fontFamily: "'Barlow',sans-serif", fontWeight: 800,
                          fontSize: "0.65rem", letterSpacing: "0.06em",
                          textTransform: "uppercase", cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(22,163,74,0.3)",
                        }}
                      >✓ Mark Paid</button>
                    )}
                  </div>
                )}

                {/* Notes */}
                {order.notes && (
                  <div style={{ padding: "0.5rem 1.1rem", fontSize: "0.75rem", color: "#92400e", background: "rgba(249,115,22,0.04)", borderBottom: "1px solid rgba(249,115,22,0.08)" }}>
                    💬 {order.notes}
                  </div>
                )}

                {/* Footer: Total + Actions */}
                <div style={{ padding: "0.8rem 1.1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.62rem", color: "#92400e", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Total</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", color: "#1c0a00", lineHeight: 1 }}>₹{order.totalAmount}</div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <a href={`tel:${order.customer?.phone}`} style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1rem", textDecoration: "none", cursor: "pointer",
                    }} title="Call customer">📞</a>

                    {nextStatus && order.status !== "delivered" && order.status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(order._id || order.orderId, nextStatus)}
                        style={{
                          background: "linear-gradient(135deg, #D0161B, #F97316)",
                          color: "#fff", border: "none", borderRadius: "0.4rem",
                          padding: "0.4rem 1rem",
                          fontFamily: "'Barlow', sans-serif", fontWeight: 800,
                          fontSize: "0.68rem", letterSpacing: "0.08em",
                          textTransform: "uppercase", cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(208,22,27,0.25)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        → {nextStatus}
                      </button>
                    )}

                    {order.status !== "delivered" && order.status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(order._id || order.orderId, "cancelled")}
                        style={{
                          background: "#fff", border: "1.5px solid rgba(220,38,38,0.3)",
                          color: "#DC2626", borderRadius: "0.4rem",
                          padding: "0.4rem 0.7rem",
                          fontFamily: "'Barlow', sans-serif", fontWeight: 800,
                          fontSize: "0.65rem", cursor: "pointer",
                        }}
                      >✕</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}