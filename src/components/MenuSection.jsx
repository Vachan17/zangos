import { useState } from "react";
import MenuCard from "./MenuCard";
import MenuEditModal from "./MenuEditModal";

export default function MenuSection({ items, categories, activeCategory, onCategoryChange, loading, onAddToCart, user, onMenuUpdate }) {
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const isAdmin = user?.role === "admin" || user?.role === "employee";

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

        {isAdmin && (
          <button 
            onClick={() => setShowAddModal(true)}
            style={{
              marginTop: "1.5rem", background: "linear-gradient(135deg, #1c0a00, #444)", color: "#fff",
              border: "none", borderRadius: "0.5rem", padding: "0.7rem 1.5rem",
              fontFamily: "'Barlow', sans-serif", fontWeight: 800, fontSize: "0.8rem",
              letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
              boxShadow: "0 8px 25px rgba(0,0,0,0.2)", transition: "transform 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}
          >
            + Add New Product
          </button>
        )}
      </div>

      {/* Category filters */}
      <div style={{ display:"flex", gap:"0.8rem", justifyContent:"center", flexWrap:"wrap", marginBottom:"4rem" }}>
        {categories.map((cat, i) => (
          <button 
            key={cat} 
            onClick={() => onCategoryChange(cat)} 
            style={{
              fontFamily:"'Barlow',sans-serif", fontWeight:800,
              fontSize:"0.75rem", letterSpacing:"0.12em", textTransform:"uppercase",
              padding:"0.7rem 1.6rem", borderRadius:"0.5rem",
              border: activeCategory === cat ? "none" : "1px solid rgba(0,0,0,0.1)",
              background: activeCategory === cat ? "#111" : "#fff",
              color: activeCategory === cat ? "#fff" : "#111",
              cursor:"pointer", transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: activeCategory === cat ? "0 10px 25px rgba(0,0,0,0.2)" : "0 4px 10px rgba(0,0,0,0.02)",
              animation: `cardReveal 0.5s cubic-bezier(0.23, 1, 0.32, 1) backwards`,
              animationDelay: `${i * 0.05}s`
            }}
            onMouseEnter={e => {
              if (activeCategory !== cat) {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.06)";
              }
            }}
            onMouseLeave={e => {
              if (activeCategory !== cat) {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.02)";
              }
            }}
          >
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
          perspective: "1200px",
          transformStyle: "preserve-3d",
          animation: "boxPanIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
        }}>
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",
            gap:"1.5rem", maxWidth:1200, margin:"0 auto",
          }}>
            {items.map((item, idx) => (
            <MenuCard 
              key={item._id} 
              item={item} 
              onAddToCart={onAddToCart} 
              user={user}
              onEdit={() => setEditingItem(item)}
              onDelete={onMenuUpdate}
                animationIndex={idx}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {(editingItem || showAddModal) && (
        <MenuEditModal 
          item={editingItem} 
          onClose={() => { setEditingItem(null); setShowAddModal(false); }}
          onSave={onMenuUpdate}
        />
      )}

      <style>{`
        @keyframes boxPanIn {
          0% {
            transform: rotateX(25deg) rotateY(-15deg) translateZ(-100px);
            opacity: 0;
          }
          100% {
            transform: rotateX(0) rotateY(0) translateZ(0);
            opacity: 1;
          }
        }

        @keyframes menuFlipZoom {
          0% {
            transform: rotateY(90deg) rotateX(20deg) scale(0.5);
            opacity: 0;
          }
          70% {
            transform: rotateY(-10deg) rotateX(-5deg) scale(1.05);
          }
          100% {
            transform: rotateY(0) rotateX(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}