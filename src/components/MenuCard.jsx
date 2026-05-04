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

function MenuCard({ item, onAddToCart, user, onEdit, onDelete }) {
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
      style={{ perspective:"1000px", cursor:"pointer", height:350 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setFlipped(f => !f)}
    >
      <div style={{
        position:"relative", width:"100%", height:"100%",
        transformStyle:"preserve-3d",
        transform: flipped ? "rotateY(180deg)" : hovered ? "rotateY(-7deg) rotateX(3deg) scale(1.03)" : "rotateY(0deg)",
        transition:"transform 0.5s cubic-bezier(0.4,0.2,0.2,1)",
      }}>

        {/* ── FRONT ── */}
        <div style={{
          position:"absolute", inset:0, backfaceVisibility:"hidden",
          background:"#fff",
          borderRadius:"1rem",
          border:`1.5px solid ${hovered && !flipped ? "#F97316" : "rgba(249,115,22,0.15)"}`,
          boxShadow: hovered && !flipped
            ? "0 20px 50px rgba(249,115,22,0.2)"
            : "0 4px 20px rgba(0,0,0,0.08)",
          overflow:"hidden", display:"flex", flexDirection:"column",
          transition:"border-color 0.3s, box-shadow 0.3s",
        }}>
          {/* Photo */}
          <div style={{ height:160, position:"relative", overflow:"hidden", flexShrink:0 }}>
            <img src={imgSrc} alt={item.name} onError={() => setImgError(true)} style={{
              width:"100%", height:"100%", objectFit:"cover", display:"block",
              transform: hovered && !flipped ? "scale(1.07)" : "scale(1)",
              transition:"transform 0.6s ease",
            }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45) 100%)" }} />

            {/* Tags */}
            {item.tags?.length > 0 && (
              <div style={{ position:"absolute", top:10, left:10, display:"flex", gap:"0.3rem", flexWrap:"wrap" }}>
                {item.tags.slice(0,2).map(tag => (
                  <span key={tag} style={{
                    fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:"0.58rem",
                    letterSpacing:"0.08em", textTransform:"uppercase",
                    padding:"0.2rem 0.55rem", borderRadius:"2rem",
                    background: TAG_COLORS[tag]?.bg || "#F97316",
                    color: TAG_COLORS[tag]?.text || "#fff",
                    boxShadow:"0 2px 6px rgba(0,0,0,0.2)",
                  }}>{tag}</span>
                ))}
              </div>
            )}

            {/* Admin Controls */}
            {isAdmin && !flipped && (
              <div style={{ position:"absolute", top:10, right:10, display:"flex", gap:"0.4rem" }}>
                <button onClick={(e) => { e.stopPropagation(); onEdit(); }} style={{ background:"rgba(255,255,255,0.9)", border:"none", borderRadius:"50%", width:28, height:28, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.8rem" }}>✎</button>
                <button onClick={doDelete} style={{ background:"rgba(208,22,27,0.9)", color:"#fff", border:"none", borderRadius:"50%", width:28, height:28, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.8rem" }}>✕</button>
              </div>
            )}

            {/* Price badge */}
            <div style={{
              position:"absolute", bottom:10, right:10,
              background:"rgba(255,247,237,0.95)", backdropFilter:"blur(6px)",
              border:"1px solid rgba(249,115,22,0.4)", borderRadius:"0.4rem",
              padding:"0.2rem 0.6rem",
            }}>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.3rem", color:"#D0161B", lineHeight:1 }}>
                ₹{lowestPrice}
              </span>
            </div>
          </div>

          {/* Text */}
          <div style={{ padding:"0.8rem 1rem 0.9rem", flex:1, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
            <div>
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.2rem", letterSpacing:"0.05em", color:"#1c0a00", lineHeight:1.15, marginBottom:"0.25rem" }}>
                {item.name.toUpperCase()}
              </h3>
              <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:"0.72rem", color:"#92400e", lineHeight:1.5 }}>
                {item.description}
              </p>
            </div>

            <button onClick={doAdd} style={{
              marginTop:"0.75rem", width:"100%",
              background: flash ? "#16a34a" : "#F97316",
              color:"#fff", border:"none", borderRadius:"0.35rem",
              padding:"0.6rem 1rem",
              fontFamily:"'Barlow',sans-serif", fontWeight:800,
              fontSize:"0.75rem", letterSpacing:"0.08em", textTransform:"uppercase",
              cursor:"pointer", transition:"background 0.25s, transform 0.15s",
              boxShadow: flash ? "0 4px 14px rgba(22,163,74,0.35)" : "0 4px 14px rgba(249,115,22,0.35)",
              transform: flash ? "scale(0.97)" : "scale(1)",
            }}>
              {flash ? "✓ Added to Cart!" : `+ Add  ₹${item.variants[selectedVar]?.price}`}
            </button>
          </div>
        </div>

        {/* ── BACK ── */}
        <div style={{
          position:"absolute", inset:0, backfaceVisibility:"hidden",
          transform:"rotateY(180deg)",
          background:"#FFF7ED",
          borderRadius:"1rem",
          border:"1.5px solid #F97316",
          boxShadow:"0 16px 40px rgba(249,115,22,0.2)",
          display:"flex", flexDirection:"column",
          overflow:"hidden",
        }}>
          {/* Blurred photo bg */}
          <img src={imgSrc} alt="" style={{
            position:"absolute", inset:0, width:"100%", height:"100%",
            objectFit:"cover", filter:"blur(20px) brightness(0.15) saturate(0.8)", transform:"scale(1.1)",
            zIndex:0,
          }} />
          <div style={{ position:"absolute", inset:0, background:"rgba(255,247,237,0.92)", zIndex:1 }} />

          <div style={{ position:"relative", zIndex:2, padding:"1.2rem 1.2rem 0", flex:1 }}>
            <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.1rem", letterSpacing:"0.08em", color:"#D0161B", marginBottom:"0.8rem" }}>
              {item.name.toUpperCase()}
            </h3>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
              {item.variants?.map((v, i) => (
                <div key={i} onClick={e => { e.stopPropagation(); setSelectedVar(i); }} style={{
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"0.5rem 0.8rem",
                  background: selectedVar === i ? "rgba(249,115,22,0.15)" : "#fff",
                  borderRadius:"0.45rem",
                  border:`1.5px solid ${selectedVar === i ? "#F97316" : "rgba(249,115,22,0.2)"}`,
                  cursor:"pointer", transition:"all 0.2s",
                }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:"0.8rem", color:"#1c0a00", fontFamily:"'Barlow',sans-serif" }}>
                      {v.label} {selectedVar === i && <span style={{ color:"#F97316" }}>✓</span>}
                    </div>
                    {v.includes && <div style={{ fontSize:"0.62rem", color:"#92400e", marginTop:"0.1rem" }}>{v.includes}</div>}
                  </div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.25rem", color:"#D0161B" }}>₹{v.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position:"relative", zIndex:2, padding:"0.8rem 1.2rem 1.2rem", display:"flex", gap:"0.6rem" }}>
            <button onClick={e => { e.stopPropagation(); doAdd(e); }} style={{
              flex:1, background: flash ? "#16a34a" : "#D0161B",
              color:"#fff", border:"none", borderRadius:"0.4rem", padding:"0.65rem",
              fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:"0.72rem",
              letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer",
              transition:"background 0.25s",
              boxShadow:"0 4px 14px rgba(208,22,27,0.3)",
            }}>
              {flash ? "✓ Added!" : `+ Add  ₹${item.variants[selectedVar]?.price}`}
            </button>
            <button onClick={e => { e.stopPropagation(); setFlipped(false); }} style={{
              background:"#fff", border:"1.5px solid rgba(249,115,22,0.3)",
              color:"#92400e", borderRadius:"0.4rem", padding:"0.65rem 0.9rem",
              fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:"0.72rem",
              cursor:"pointer",
            }}>← Back</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MenuCard;