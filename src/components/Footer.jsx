export default function Footer() {
  return (
    <footer style={{ background:"#1c0a00", borderTop:"3px solid #F97316", padding:"3rem 2.5rem 2rem" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", flexWrap:"wrap", gap:"2.5rem", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.2rem", letterSpacing:"0.12em", color:"#fff", marginBottom:"0.4rem" }}>ZANGOS</div>
          <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:"0.75rem", color:"#92400e", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"0.8rem" }}>
            Hot Chicken · Burgers · Wings
          </div>
          <a href="https://www.zangoshotchicken.com" target="_blank" rel="noreferrer" style={{ color:"#F97316", fontSize:"0.78rem", fontFamily:"'Barlow',sans-serif", fontWeight:600, textDecoration:"none" }}>
            www.zangoshotchicken.com
          </a>
        </div>
        <div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1rem", letterSpacing:"0.1em", color:"#fff", marginBottom:"1rem" }}>QUICK LINKS</div>
          <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:"0.5rem" }}>
            {["Menu","Locations","Careers","Franchise"].map(l => (
              <li key={l}><a href="#" style={{ color:"#92400e", fontFamily:"'Barlow',sans-serif", fontSize:"0.8rem", textDecoration:"none", transition:"color 0.2s" }}
                onMouseEnter={e => e.target.style.color="#F97316"}
                onMouseLeave={e => e.target.style.color="#92400e"}
              >{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1rem", letterSpacing:"0.1em", color:"#fff", marginBottom:"1rem" }}>FOLLOW US</div>
          <div style={{ display:"flex", gap:"0.8rem" }}>
            {["📸 Instagram","📘 Facebook"].map(s => (
              <a key={s} href="#" style={{
                color:"#92400e", fontFamily:"'Barlow',sans-serif", fontSize:"0.75rem",
                fontWeight:600, textDecoration:"none", padding:"0.4rem 0.8rem",
                border:"1px solid rgba(249,115,22,0.3)", borderRadius:"0.3rem",
                transition:"all 0.2s",
              }}
                onMouseEnter={e => { e.target.style.borderColor="#F97316"; e.target.style.color="#F97316"; }}
                onMouseLeave={e => { e.target.style.borderColor="rgba(249,115,22,0.3)"; e.target.style.color="#92400e"; }}
              >{s}</a>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth:1100, margin:"2rem auto 0", paddingTop:"1.5rem", borderTop:"1px solid rgba(249,115,22,0.15)", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem" }}>
        <span style={{ color:"#4a2000", fontSize:"0.7rem", fontFamily:"'Barlow',sans-serif" }}>© 2025 Zangos Hot Chicken. All rights reserved.</span>
        <span style={{ color:"#4a2000", fontSize:"0.7rem", fontFamily:"'Barlow',sans-serif" }}>@zangos_ka.india</span>
      </div>
    </footer>
  );
}