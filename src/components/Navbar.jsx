import { useState, useEffect } from "react";

const LINKS = [
  { label: "Menu",      id: "menu" },
  { label: "About",     id: "about" },
  { label: "Locations", id: "locations" },
];

function Navbar({ cartCount=0, onCartClick, orderCount=0, onHistoryClick, user, onAuthClick, onLogout }) {
  const [scrolled,     setScrolled]     = useState(false);
  const [open,         setOpen]         = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
    setOpen(false);
  };

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:1000,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 2rem",
        height: scrolled ? "62px" : "80px",
        background: "rgba(10,4,0,0.92)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(249,115,22,0.3)",
        boxShadow: scrolled ? "0 2px 20px rgba(249,115,22,0.15)" : "none",
        transition: "height 0.3s ease, box-shadow 0.3s ease",
      }}>
        {/* Logo */}
        <div onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
          style={{ display:"flex", alignItems:"center", gap:"0.8rem", cursor:"pointer", flexShrink:0 }}>
          <img src={`${import.meta.env.BASE_URL}zb.jpeg`} alt="Zangos Logo" style={{ width:42, height:42, borderRadius:"50%", objectFit:"cover", border:"2px solid #F97316", boxShadow:"0 0 15px rgba(249,115,22,0.3)" }} />
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.8rem", letterSpacing:"0.1em", color:"#fff" }}>ZANGOS</span>
        </div>

        {/* Desktop nav */}
        <ul style={{ display:"flex", gap:"1.5rem", listStyle:"none", alignItems:"center" }}>
          {LINKS.map(({ label, id }) => (
            <li key={id}>
              <button onClick={() => go(id)} style={{
                background:"none", border:"none", color:"#d4af9e",
                fontFamily:"'Barlow',sans-serif", fontWeight:700,
                fontSize:"0.82rem", letterSpacing:"0.1em", textTransform:"uppercase",
                cursor:"pointer", padding:0,
              }}
                onMouseEnter={e => e.currentTarget.style.color="#F97316"}
                onMouseLeave={e => e.currentTarget.style.color="#d4af9e"}
              >{label}</button>
            </li>
          ))}

          {/* Orders history */}
          <li>
            <button onClick={onHistoryClick} style={{
              background:"rgba(249,115,22,0.1)", border:"1px solid rgba(249,115,22,0.4)",
              color:"#d4af9e", borderRadius:"0.3rem", padding:"0.42rem 0.8rem",
              fontFamily:"'Barlow',sans-serif", fontWeight:700,
              fontSize:"0.72rem", letterSpacing:"0.08em", textTransform:"uppercase",
              cursor:"pointer", display:"flex", alignItems:"center", gap:"0.35rem", transition:"all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background="#F97316"; e.currentTarget.style.color="#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(249,115,22,0.1)"; e.currentTarget.style.color="#d4af9e"; }}
            >
              📜
              {orderCount > 0 && <span style={{ background:"#D0161B", color:"#fff", borderRadius:"50%", width:16, height:16, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"0.6rem", fontWeight:900 }}>{orderCount}</span>}
            </button>
          </li>

          {/* Cart */}
          <li>
            <button onClick={onCartClick} style={{
              background: cartCount > 0 ? "#D0161B" : "#F97316",
              border:"none", color:"#fff", borderRadius:"2rem",
              padding:"0.48rem 1rem 0.48rem 0.85rem",
              fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:"0.78rem",
              cursor:"pointer", display:"flex", alignItems:"center", gap:"0.4rem",
              boxShadow: cartCount > 0 ? "0 4px 16px rgba(208,22,27,0.4)" : "0 4px 12px rgba(249,115,22,0.3)",
              transition:"all 0.2s",
            }}>
              🛒 Cart
              {cartCount > 0 && <span style={{ background:"#fff", color:"#D0161B", borderRadius:"50%", width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.68rem", fontWeight:900 }}>{cartCount}</span>}
            </button>
          </li>

          {/* Auth / Profile */}
          <li style={{ position:"relative" }}>
            {user ? (
              <>
                <button onClick={() => setProfileOpen(o => !o)} style={{
                  background:"rgba(249,115,22,0.12)", border:"1.5px solid rgba(249,115,22,0.4)",
                  color:"#d4af9e", borderRadius:"2rem",
                  padding:"0.4rem 0.9rem 0.4rem 0.6rem",
                  fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:"0.78rem",
                  cursor:"pointer", display:"flex", alignItems:"center", gap:"0.5rem",
                  transition:"all 0.2s",
                }}>
                  <div style={{ width:26, height:26, borderRadius:"50%", background:"#F97316", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"0.75rem", fontWeight:900 }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  {user.name?.split(" ")[0]}
                </button>
                {profileOpen && (
                  <div style={{
                    position:"absolute", top:"calc(100% + 10px)", right:0,
                    background:"#2a1810", border:"1.5px solid rgba(249,115,22,0.35)",
                    borderRadius:"0.7rem", padding:"0.8rem",
                    boxShadow:"0 12px 40px rgba(0,0,0,0.4)",
                    minWidth:180, zIndex:100,
                  }}>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:"0.82rem", fontWeight:700, color:"#f5deb3", marginBottom:"0.2rem" }}>{user.name}</div>
                    <div style={{ fontSize:"0.72rem", color:"#d4af9e", marginBottom:"0.8rem" }}>{user.email}</div>
                    <button onClick={() => { onHistoryClick(); setProfileOpen(false); }} style={{
                      width:"100%", background:"rgba(249,115,22,0.12)",
                      border:"1px solid rgba(249,115,22,0.3)", borderRadius:"0.3rem",
                      padding:"0.5rem", color:"#d4af9e",
                      fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:"0.75rem",
                      cursor:"pointer", marginBottom:"0.4rem", textAlign:"left",
                    }}>📜 My Orders</button>
                    <button onClick={() => { onLogout(); setProfileOpen(false); }} style={{
                      width:"100%", background:"rgba(208,22,27,0.15)",
                      border:"1px solid rgba(208,22,27,0.3)", borderRadius:"0.3rem",
                      padding:"0.5rem", color:"#ff7f50",
                      fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:"0.75rem",
                      cursor:"pointer", textAlign:"left",
                    }}>← Sign Out</button>
                  </div>
                )}
              </>
            ) : (
              <button onClick={onAuthClick} style={{
                background:"transparent", border:"1.5px solid rgba(208,22,27,0.4)",
                color:"#D0161B", borderRadius:"0.3rem", padding:"0.45rem 0.9rem",
                fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:"0.75rem",
                letterSpacing:"0.06em", textTransform:"uppercase",
                cursor:"pointer", transition:"all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background="#D0161B"; e.currentTarget.style.color="#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#D0161B"; }}
              >Sign In</button>
            )}
          </li>

          {/* Kitchen link */}
          <li>
            <a href="#/employee" style={{
              background:"rgba(249,115,22,0.1)", border:"1px solid rgba(249,115,22,0.3)",
              color:"#d4af9e", borderRadius:"0.3rem", padding:"0.42rem 0.8rem",
              fontFamily:"'Barlow',sans-serif", fontWeight:700,
              fontSize:"0.7rem", letterSpacing:"0.08em", textTransform:"uppercase",
              textDecoration:"none", transition:"all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background="#F97316"; e.currentTarget.style.color="#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(249,115,22,0.1)"; e.currentTarget.style.color="#d4af9e"; }}
            >👨‍🍳</a>
          </li>
        </ul>

        <button className="z-hamburger" onClick={() => setOpen(o => !o)} style={{ display:"none", background:"none", border:"none", color:"#d4af9e", fontSize:"1.5rem", cursor:"pointer" }}>☰</button>
      </nav>

      {/* Click outside profile closes it */}
      {profileOpen && <div onClick={() => setProfileOpen(false)} style={{ position:"fixed", inset:0, zIndex:99 }} />}

      {/* Mobile menu */}
      {open && (
        <div style={{ position:"fixed", top:62, left:0, right:0, zIndex:999, background:"rgba(15,6,2,0.97)", backdropFilter:"blur(12px)", padding:"1.2rem 2rem", display:"flex", flexDirection:"column", gap:"0.8rem", borderBottom:"2px solid #F97316" }}>
          {LINKS.map(({ label, id }) => (
            <button key={id} onClick={() => go(id)} style={{ background:"none", border:"none", color:"#d4af9e", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:"1rem", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", textAlign:"left" }}>{label}</button>
          ))}
          <button onClick={() => { onCartClick(); setOpen(false); }} style={{ background:"#D0161B", border:"none", color:"#fff", fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:"0.9rem", cursor:"pointer", padding:"0.7rem 1rem", borderRadius:"0.4rem", textTransform:"uppercase" }}>🛒 Cart ({cartCount})</button>
          {!user && <button onClick={() => { onAuthClick(); setOpen(false); }} style={{ background:"transparent", border:"1.5px solid #D0161B", color:"#D0161B", fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:"0.9rem", cursor:"pointer", padding:"0.7rem 1rem", borderRadius:"0.4rem", textTransform:"uppercase" }}>Sign In</button>}
        </div>
      )}

      <style>{`@media(max-width:900px){.z-hamburger{display:block !important} nav ul{display:none !important}}`}</style>
    </>
  );
}

export default Navbar;