import MenuCard from "./MenuCard";

export default function MenuSection({ items, categories, activeCategory, onCategoryChange, loading, onAddToCart }) {
  return (
    <section id="menu" style={{
      padding: "6rem 2rem",
      background: "linear-gradient(to bottom, #FFF7ED, #FFFBF5)",
      position: "relative",
    }}>
      {/* Top divider flame */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 6,
        background: "linear-gradient(90deg, #D0161B 0%, #F97316 50%, #D0161B 100%)",
      }} />

      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <span style={{
          fontFamily: "'Barlow',sans-serif", fontWeight: 800,
          fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase",
          color: "#F97316", display: "block", marginBottom: "0.7rem",
        }}>— OUR MENU —</span>
        <h2 style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          letterSpacing: "0.06em", color: "#1c0a00", lineHeight: 1,
        }}>WHAT'S COOKING 🔥</h2>
      </div>

      {/* Category filters */}
      <div style={{ display:"flex", gap:"0.6rem", justifyContent:"center", flexWrap:"wrap", marginBottom:"3rem" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => onCategoryChange(cat)} style={{
            fontFamily:"'Barlow',sans-serif", fontWeight:700,
            fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase",
            padding:"0.55rem 1.3rem", borderRadius:"2rem",
            border: activeCategory === cat ? "none" : "1.5px solid rgba(249,115,22,0.3)",
            background: activeCategory === cat ? "#F97316" : "#fff",
            color: activeCategory === cat ? "#fff" : "#92400e",
            cursor:"pointer", transition:"all 0.22s ease",
            boxShadow: activeCategory === cat ? "0 4px 16px rgba(249,115,22,0.35)" : "none",
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign:"center", padding:"4rem", fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem", color:"#F97316", letterSpacing:"0.1em" }}>
          LOADING MENU...
        </div>
      ) : (
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",
          gap:"1.5rem", maxWidth:1200, margin:"0 auto",
        }}>
          {items.map(item => <MenuCard key={item._id} item={item} onAddToCart={onAddToCart} />)}
        </div>
      )}
    </section>
  );
}