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
        display:"flex", alignItems:"center",
        padding:"0 4.5rem",
        height: scrolled ? "70px" : "90px",
        background: scrolled ? "rgba(2,1,0,0.92)" : "rgba(2,1,0,0.3)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        {/* Left: Logo */}
        <div onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
          style={{ display:"flex", alignItems:"center", gap:"0.8rem", cursor:"pointer", flex: 1 }}>
          <video 
            src={`${import.meta.env.BASE_URL}zangoslogo.mp4`} 
            autoPlay loop muted playsInline 
            style={{ width:40, height:40, borderRadius:"50%", objectFit:"cover", border:"1px solid rgba(255,255,255,0.3)" }} 
          />
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.2rem", letterSpacing:"0.06em", color:"#fff" }}>ZANGOS</span>
        </div>

        {/* Center: Nav Links */}
        <ul style={{ display:"flex", gap:"2.5rem", listStyle:"none", alignItems:"center", margin:0, padding:0, flex: 2, justifyContent: "center" }}>
          {LINKS.map(({ label, id }) => (
            <li key={id}>
              <button onClick={() => go(id)} style={{
                background:"none", border:"none", color:"#fff",
                fontFamily:"'Barlow',sans-serif", fontWeight:600,
                fontSize:"0.88rem", letterSpacing:"0.1em", textTransform:"uppercase",
                cursor:"pointer", padding:"0.5rem 0", opacity:0.7,
                transition:"all 0.3s ease",
                position: "relative",
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity="1"; e.currentTarget.style.color="#F97316"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity="0.7"; e.currentTarget.style.color="#fff"; }}
              >{label}</button>
            </li>
          ))}
        </ul>

        {/* Right: Actions */}
        <div style={{ display:"flex", alignItems:"center", gap:"1.2rem", flex: 1, justifyContent: "flex-end" }}>
          {user ? (
            <div style={{ position:"relative" }}>
              <button onClick={() => setProfileOpen(o => !o)} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
                color:"#fff", borderRadius:"2rem", padding:"0.45rem 1.1rem",
                fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:"0.82rem",
                cursor:"pointer", display:"flex", alignItems:"center", gap:"0.7rem",
                transition: "all 0.3s ease"
              }} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.06)"}>
                <div style={{ width:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg, #D0161B, #F97316)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"0.75rem", fontWeight:800 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                {user.name?.split(" ")[0]}
              </button>
              {profileOpen && (
                <div style={{
                  position:"absolute", top:"calc(100% + 15px)", right:0,
                  background:"#0a0a0a", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:"1rem", padding:"1.2rem", boxShadow:"0 25px 50px rgba(0,0,0,0.6)", minWidth:220,
                  animation: "navbarSlideIn 0.3s ease-out"
                }}>
                  <div style={{ fontWeight:700, color:"#fff", fontSize:"0.95rem", marginBottom:"1.2rem" }}>{user.name}</div>
                  <button onClick={() => { onHistoryClick(); setProfileOpen(false); }} style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"none", borderRadius:"0.5rem", padding:"0.75rem", color:"#fff", fontSize:"0.82rem", cursor:"pointer", marginBottom:"0.6rem", textAlign:"left", transition:"background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.08)"} onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.04)"}>📜 My Orders</button>
                  <button onClick={() => { onLogout(); setProfileOpen(false); }} style={{ width:"100%", background:"rgba(208,22,27,0.08)", border:"none", borderRadius:"0.5rem", padding:"0.75rem", color:"#ff4d4d", fontSize:"0.82rem", cursor:"pointer", textAlign:"left", transition:"background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="rgba(208,22,27,0.15)"} onMouseLeave={e => e.currentTarget.style.background="rgba(208,22,27,0.08)"}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={onAuthClick} style={{
              background:"transparent", border:"1px solid rgba(255,255,255,0.25)", color:"#fff", borderRadius:"0.5rem",
              padding:"0.65rem 1.4rem", fontFamily:"'Barlow',sans-serif", fontWeight:800,
              fontSize:"0.82rem", textTransform:"uppercase", cursor:"pointer", transition:"all 0.3s ease"
            }} onMouseEnter={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.color="#000"; }} onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#fff"; }}>
              Join Now
            </button>
          )}
          
          <button onClick={onCartClick} style={{
            background:"#D0161B", border:"none", color:"#fff", borderRadius:"0.5rem",
            padding:"0.7rem 1.3rem", fontFamily:"'Barlow',sans-serif", fontWeight:800,
            fontSize:"0.82rem", cursor:"pointer", transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(208,22,27,0.3)"
          }} onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform="none"}>
            CART {cartCount > 0 && <span style={{ marginLeft:"0.5rem", fontWeight:900 }}>({cartCount})</span>}
          </button>

          <a href="#/employee" style={{
            opacity:0.5, fontSize:"1.3rem", textDecoration:"none", transition:"all 0.3s ease", display: "flex", alignItems: "center"
          }} onMouseEnter={e => e.currentTarget.style.opacity="1"} onMouseLeave={e => e.currentTarget.style.opacity="0.5"}>👨‍🍳</a>
        </div>

        <button className="z-hamburger" onClick={() => setOpen(o => !o)} style={{ display:"none", background:"none", border:"none", color:"#fff", fontSize:"1.8rem", cursor:"pointer" }}>☰</button>
      </nav>

      {/* Click outside profile closes it */}
      {profileOpen && <div onClick={() => setProfileOpen(false)} style={{ position:"fixed", inset:0, zIndex:99 }} />}

      {/* Mobile menu */}
      {open && (
        <div style={{ position:"fixed", top:70, left:0, right:0, zIndex:999, background:"rgba(10,5,2,0.98)", backdropFilter:"blur(15px)", padding:"1.5rem 2rem", display:"flex", flexDirection:"column", gap:"1rem", borderBottom:"2px solid #D0161B", animation:"navbarSlideIn 0.3s ease-out" }}>
          {LINKS.map(({ label, id }) => (
            <button key={id} onClick={() => go(id)} style={{ background:"none", border:"none", color:"#fff", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:"1.1rem", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", textAlign:"left", opacity:0.8 }}>{label}</button>
          ))}
          <div style={{ height:"1px", background:"rgba(255,255,255,0.1)", margin:"0.5rem 0" }} />
          <button onClick={() => { onCartClick(); setOpen(false); }} style={{ background:"#D0161B", border:"none", color:"#fff", fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:"1rem", cursor:"pointer", padding:"0.8rem 1.2rem", borderRadius:"0.5rem", textTransform:"uppercase" }}>🛒 Cart ({cartCount})</button>
          {!user && <button onClick={() => { onAuthClick(); setOpen(false); }} style={{ background:"transparent", border:"1.5px solid #fff", color:"#fff", fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:"1rem", cursor:"pointer", padding:"0.8rem 1.2rem", borderRadius:"0.5rem", textTransform:"uppercase" }}>Join Now</button>}
        </div>
      )}

      <style>{`
        @media(max-width:1100px){
          nav { padding: 0 2rem !important; }
          nav > ul { display: none !important; }
          .z-hamburger { display: block !important; }
          div[style*="flex: 1"] { flex: none !important; }
        }
        @keyframes navbarSlideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

export default Navbar;