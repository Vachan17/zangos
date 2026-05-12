import { useState } from "react";
import { API_BASE } from "../config";

const TAG_COLORS = {
  "Nashville Hot": { bg:"#D0161B",  text:"#fff" },
  "Spicy":         { bg:"#F97316",  text:"#fff" },
  "Bestseller":    { bg:"#f5a623",  text:"#111" },
  "Signature":     { bg:"#7c3aed",  text:"#fff" },
  "Veg":           { bg:"#16a34a",  text:"#fff" },
};

const ITEM_IMAGES = {
  "Old Town Fried Chicken":  "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80",
  "Signature Fried Chicken": "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80",
  "Nashville Hot Chicken":   "https://images.unsplash.com/photo-1599921841143-819065a55cc5?w=600&q=80",
  "Crispy Chicken Tenders":  "https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&q=80",
  "Nashville Hot Tenders":   "https://images.unsplash.com/photo-1614398751058-eb2e0bf63e53?w=600&q=80",
  "Original Wings":          "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80",
  "Nashville Hot Wings":     "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&q=80",
  "Delight Veg Burger":      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80",
  "Crispy Chicken Burger":   "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  "Crispy Chicken Wrap":     "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80",
  "Falafel Wrap":            "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80",
  "Classic French Fries":    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80",
  "Spicy Hot French Fries":  "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=600&q=80",
  "Cheesy French Fries":     "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&q=80",
  "Chicken Loaded Fries":    "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&q=80",
};

const CAT_IMG = {
  "Fried Chicken": "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80",
  "Tenders":       "https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&q=80",
  "Wings":         "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80",
  "Burgers":       "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  "Wraps":         "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80",
  "French Fries":  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80",
};

function MenuCard({ item, onAddToCart, user, onEdit, onDelete, animationIndex = 0 }) {
  const [flipped,     setFlipped]     = useState(false);
  const [hovered,     setHovered]     = useState(false);
  const [imgError,    setImgError]    = useState(false);
  const [selectedVar, setSelectedVar] = useState(0);
  const [flash,       setFlash]       = useState(false);

  const isAdmin = user?.role === "admin" || user?.role === "employee";

  const imgSrc = item.image || (imgError
    ? (CAT_IMG[item.category] || CAT_IMG["Fried Chicken"])
    : (ITEM_IMAGES[item.name] || CAT_IMG[item.category]));

  const lowestPrice = item.variants?.length
    ? Math.min(...item.variants.map(v => v.price)) : null;

  const doAdd = (e) => {
    e.stopPropagation();
    onAddToCart?.(item, item.variants[selectedVar]);
    setFlash(true);
    setTimeout(() => setFlash(false), 1200);
  };

  const doDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete ${item.name}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/menu/${item._id}`, { method: "DELETE" });
      if (res.ok) onDelete?.();
    } catch (err) { console.error(err); }
  };

  return (
    <div
      className="menu-card-container"
      style={{ 
        perspective:"1200px", 
        cursor:"pointer", 
        height:380,
        animation: `menuFlipZoom 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
        animationDelay: `${animationIndex * 0.05}s`,
        transformStyle: "preserve-3d"
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setFlipped(f => !f)}
    >
      <div style={{
        position:"relative", width:"100%", height:"100%",
        transformStyle:"preserve-3d",
        transform: flipped ? "rotateY(180deg)" : hovered ? "rotateY(-8deg) rotateX(4deg) scale(1.08) translateY(-12px)" : "rotateY(0deg)",
        transition:"transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease",
      }}>

        {/* ── FRONT ── */}
        <div style={{
          position:"absolute", inset:0, backfaceVisibility:"hidden",
          background:"#fff",
          borderRadius:"1.2rem",
          border:`1px solid ${hovered && !flipped ? "rgba(208, 22, 27, 0.3)" : "rgba(0,0,0,0.06)"}`,
          boxShadow: hovered && !flipped
            ? "0 40px 80px rgba(208,22,27,0.2), 0 0 30px rgba(249,115,22,0.1)"
            : "0 10px 30px rgba(0,0,0,0.04)",
          overflow:"hidden", display:"flex", flexDirection:"column",
          transition:"all 0.4s ease",
        }}>
          {/* Photo */}
          <div style={{ height:180, position:"relative", overflow:"hidden", flexShrink:0 }}>
            <img src={imgSrc} alt={item.name} onError={() => setImgError(true)} style={{
              width:"100%", height:"100%", objectFit:"cover", display:"block",
              transform: hovered && !flipped ? "scale(1.12) rotate(1deg)" : "scale(1)",
              transition:"transform 0.8s cubic-bezier(0.2, 0, 0.2, 1)",
            }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.5) 100%)", opacity: hovered ? 0.8 : 0.6, transition: "opacity 0.3s" }} />

            {/* Tags */}
            {item.tags?.length > 0 && (
              <div style={{ position:"absolute", top:15, left:15, display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
                {item.tags.slice(0,2).map(tag => (
                  <span key={tag} style={{
                    fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:"0.6rem",
                    letterSpacing:"0.1em", textTransform:"uppercase",
                    padding:"0.25rem 0.7rem", borderRadius:"0.3rem",
                    background: TAG_COLORS[tag]?.bg || "#D0161B",
                    color: TAG_COLORS[tag]?.text || "#fff",
                    boxShadow:"0 4px 10px rgba(0,0,0,0.2)",
                  }}>{tag}</span>
                ))}
              </div>
            )}

            {/* Admin Controls */}
            {isAdmin && !flipped && (
              <div style={{ position:"absolute", top:15, right:15, display:"flex", gap:"0.5rem" }}>
                <button onClick={(e) => { e.stopPropagation(); onEdit(); }} style={{ background:"rgba(255,255,255,0.95)", border:"none", borderRadius:"0.4rem", width:32, height:32, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>✎</button>
                <button onClick={doDelete} style={{ background:"#D0161B", color:"#fff", border:"none", borderRadius:"0.4rem", width:32, height:32, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", boxShadow: "0 4px 10px rgba(208,22,27,0.3)" }}>✕</button>
              </div>
            )}

            {/* Price badge */}
            <div style={{
              position:"absolute", bottom:15, right:15,
              background:"#fff",
              borderRadius:"0.5rem",
              padding:"0.3rem 0.8rem",
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              transform: hovered ? "translateY(-5px)" : "none",
              transition: "transform 0.3s ease"
            }}>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.5rem", color:"#D0161B", lineHeight:1 }}>
                ₹{lowestPrice}
              </span>
            </div>
          </div>

          {/* Text Content */}
          <div style={{ padding:"1.2rem 1.4rem", flex:1, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
            <div>
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.4rem", letterSpacing:"0.04em", color:"#111", lineHeight:1, marginBottom:"0.5rem" }}>
                {item.name.toUpperCase()}
              </h3>
              <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:"0.78rem", color:"#666", lineHeight:1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {item.description}
              </p>
            </div>

            <button onClick={doAdd} style={{
              marginTop:"1rem", width:"100%",
              background: flash ? "#16a34a" : "#111",
              color:"#fff", border:"none", borderRadius:"0.5rem",
              padding:"0.8rem 1rem",
              fontFamily:"'Barlow',sans-serif", fontWeight:800,
              fontSize:"0.8rem", letterSpacing:"0.1em", textTransform:"uppercase",
              cursor:"pointer", transition:"all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              boxShadow: flash ? "0 10px 25px rgba(22,163,74,0.4)" : "0 10px 25px rgba(0,0,0,0.2)",
              transform: hovered ? "translateY(-2px)" : "none",
            }}>
              {flash ? "✓ Added!" : `Add to Cart — ₹${item.variants[selectedVar]?.price}`}
            </button>
          </div>
        </div>

        {/* ── BACK ── */}
        <div style={{
          position:"absolute", inset:0, backfaceVisibility:"hidden",
          transform:"rotateY(180deg)",
          background:"#fff",
          borderRadius:"1.2rem",
          border:"1px solid #D0161B",
          boxShadow:"0 30px 70px rgba(208,22,27,0.2)",
          display:"flex", flexDirection:"column",
          overflow:"hidden",
        }}>
          {/* Subtle bg detail */}
          <div style={{ position:"absolute", top:-50, right:-50, width:150, height:150, background:"rgba(208,22,27,0.03)", borderRadius:"50%" }} />

          <div style={{ position:"relative", zIndex:2, padding:"1.5rem 1.5rem 0", flex:1 }}>
            <div style={{ fontSize:"0.6rem", fontWeight:900, color:"#D0161B", textTransform:"uppercase", letterSpacing:"0.2em", marginBottom:"0.4rem" }}>Select Variation</div>
            <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.3rem", letterSpacing:"0.06em", color:"#111", marginBottom:"1.2rem" }}>
              {item.name.toUpperCase()}
            </h3>
            
            <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
              {item.variants?.map((v, i) => (
                <div key={i} onClick={e => { e.stopPropagation(); setSelectedVar(i); }} style={{
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"0.7rem 1rem",
                  background: selectedVar === i ? "rgba(208,22,27,0.04)" : "transparent",
                  borderRadius:"0.6rem",
                  border:`1px solid ${selectedVar === i ? "#D0161B" : "rgba(0,0,0,0.08)"}`,
                  cursor:"pointer", transition:"all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                }}>
                  <div>
                    <div style={{ fontWeight:800, fontSize:"0.85rem", color:"#111", fontFamily:"'Barlow',sans-serif" }}>
                      {v.label}
                    </div>
                    {v.includes && <div style={{ fontSize:"0.65rem", color:"#888", marginTop:"0.1rem" }}>{v.includes}</div>}
                  </div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.4rem", color: selectedVar === i ? "#D0161B" : "#444" }}>₹{v.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position:"relative", zIndex:2, padding:"1.2rem 1.5rem 1.5rem", display:"flex", gap:"0.8rem" }}>
            <button onClick={e => { e.stopPropagation(); doAdd(e); }} style={{
              flex:2, background: flash ? "#16a34a" : "#D0161B",
              color:"#fff", border:"none", borderRadius:"0.5rem", padding:"0.85rem",
              fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:"0.78rem",
              letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer",
              transition:"all 0.3s",
              boxShadow:"0 10px 25px rgba(208,22,27,0.3)",
            }}>
              {flash ? "✓ Success" : `Confirm Add`}
            </button>
            <button onClick={e => { e.stopPropagation(); setFlipped(false); }} style={{
              flex:1, background:"#f5f5f5", border:"none",
              color:"#444", borderRadius:"0.5rem", padding:"0.85rem",
              fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:"0.72rem",
              cursor:"pointer", textTransform:"uppercase"
            }}>Close</button>
          </div>
        </div>

        <style>{`
          @keyframes cardReveal {
            from { opacity: 0; transform: translateY(30px) scale(0.9); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default MenuCard;
