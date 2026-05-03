export default function Cart({ cart, onRemove, onQtyChange, onCheckout, onClose }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{
      position:"fixed", top:0, right:0, bottom:0,
      width:"min(420px,100vw)", zIndex:2000,
      background:"#FFFBF5",
      borderLeft:"2px solid #F97316",
      boxShadow:"-12px 0 50px rgba(249,115,22,0.15)",
      display:"flex", flexDirection:"column",
      animation:"cartSlide 0.3s ease",
    }}>
      <style>{`@keyframes cartSlide{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

      {/* Header */}
      <div style={{
        padding:"1.4rem 1.5rem 1rem",
        borderBottom:"1px solid rgba(249,115,22,0.15)",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        background:"#FFF7ED",
      }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.8rem", letterSpacing:"0.1em", color:"#1c0a00" }}>
            YOUR ORDER
          </div>
          <div style={{ fontSize:"0.72rem", color:"#92400e", fontWeight:600, letterSpacing:"0.08em" }}>
            {cart.length} item{cart.length !== 1 ? "s" : ""} in cart
          </div>
        </div>
        <button onClick={onClose} style={{
          width:36, height:36, borderRadius:"50%",
          background:"rgba(249,115,22,0.1)", border:"1px solid rgba(249,115,22,0.3)",
          color:"#92400e", fontSize:"1rem", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontWeight:700,
        }}>✕</button>
      </div>

      {/* Items */}
      <div style={{ flex:1, overflowY:"auto", padding:"0.8rem 1.2rem" }}>
        {cart.length === 0 ? (
          <div style={{
            textAlign:"center", padding:"4rem 1rem",
            color:"#92400e", fontFamily:"'Barlow',sans-serif", fontSize:"0.95rem",
          }}>
            <div style={{ fontSize:"3.5rem", marginBottom:"1rem" }}>🛒</div>
            <strong>Your cart is empty!</strong><br/>
            <span style={{ color:"#a16207", fontSize:"0.85rem" }}>Browse the menu and add some items.</span>
          </div>
        ) : (
          cart.map((item, i) => (
            <div key={i} style={{
              display:"flex", gap:"0.8rem", alignItems:"center",
              padding:"0.85rem 0",
              borderBottom:"1px solid rgba(249,115,22,0.1)",
            }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:"0.88rem", color:"#1c0a00", marginBottom:"0.15rem" }}>
                  {item.name}
                </div>
                <div style={{ fontSize:"0.72rem", color:"#92400e" }}>
                  {item.variant} · ₹{item.price} each
                </div>
              </div>

              {/* Qty controls */}
              <div style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}>
                <button onClick={() => onQtyChange(i, item.qty - 1)} style={{
                  width:28, height:28, borderRadius:"50%",
                  background:"rgba(249,115,22,0.12)", border:"1px solid rgba(249,115,22,0.4)",
                  color:"#F97316", fontSize:"1rem", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700,
                }}>−</button>
                <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.1rem", color:"#1c0a00", minWidth:20, textAlign:"center" }}>
                  {item.qty}
                </span>
                <button onClick={() => onQtyChange(i, item.qty + 1)} style={{
                  width:28, height:28, borderRadius:"50%",
                  background:"rgba(249,115,22,0.12)", border:"1px solid rgba(249,115,22,0.4)",
                  color:"#F97316", fontSize:"1rem", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700,
                }}>+</button>
              </div>

              {/* Line total */}
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.2rem", color:"#D0161B", minWidth:55, textAlign:"right" }}>
                ₹{item.price * item.qty}
              </div>

              {/* Remove */}
              <button onClick={() => onRemove(i)} style={{
                background:"none", border:"none", color:"#ccc",
                cursor:"pointer", fontSize:"0.9rem", padding:"0.2rem",
                transition:"color 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.color="#D0161B"}
                onMouseLeave={e => e.currentTarget.style.color="#ccc"}
              >✕</button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {cart.length > 0 && (
        <div style={{
          padding:"1.2rem 1.5rem",
          borderTop:"2px solid rgba(249,115,22,0.2)",
          background:"#FFF7ED",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"1rem" }}>
            <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:"0.85rem", letterSpacing:"0.1em", color:"#92400e", textTransform:"uppercase" }}>
              Total
            </span>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.2rem", color:"#D0161B" }}>
              ₹{total}
            </span>
          </div>
          <button onClick={onCheckout} style={{
            width:"100%", background:"#D0161B", color:"#fff", border:"none",
            borderRadius:"0.4rem", padding:"1rem",
            fontFamily:"'Barlow',sans-serif", fontWeight:800,
            fontSize:"0.88rem", letterSpacing:"0.12em", textTransform:"uppercase",
            cursor:"pointer", boxShadow:"0 8px 24px rgba(208,22,27,0.35)",
            transition:"opacity 0.2s, transform 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity="0.9"; e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity="1"; e.currentTarget.style.transform="none"; }}
          >
            Proceed to Checkout →
          </button>
        </div>
      )}
    </div>
  );
}