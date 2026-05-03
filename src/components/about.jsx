export default function About() {
  const stats = [
    { value:"3+",  label:"Locations" },
    { value:"15+", label:"Menu Items" },
    { value:"5★",  label:"Rated" },
    { value:"∞",   label:"Spice Levels" },
  ];
  return (
    <section id="about" style={{
      padding:"7rem 2rem",
      background:"linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
      position:"relative", overflow:"hidden",
    }}>
      <div style={{
        position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(6rem,18vw,16rem)",
        color:"rgba(249,115,22,0.06)", whiteSpace:"nowrap", pointerEvents:"none",
        letterSpacing:"0.1em",
      }}>ZANGOS</div>

      <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5rem", alignItems:"center" }} className="about-grid">
          <div>
            <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:"0.7rem", letterSpacing:"0.3em", textTransform:"uppercase", color:"#F97316", display:"block", marginBottom:"1rem" }}>
              — WHO WE ARE —
            </span>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,5vw,4.5rem)", letterSpacing:"0.04em", lineHeight:1, color:"#1c0a00", marginBottom:"1.5rem" }}>
              BORN FROM<br/><span style={{ color:"#D0161B" }}>FIRE &</span><br/>FLAVOUR
            </h2>
            <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:"1rem", color:"#78350f", lineHeight:1.8, marginBottom:"1rem" }}>
              Zangos Hot Chicken brings the legendary Nashville hot chicken tradition straight to your table — with our own fiery twist. Every piece is hand-battered, double-fried to golden perfection, and coated in our secret spice blend.
            </p>
            <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:"1rem", color:"#78350f", lineHeight:1.8 }}>
              From mild to X Hot — we dare you to go hotter. Visit{" "}
              <a href="https://www.zangoshotchicken.com" target="_blank" rel="noreferrer" style={{ color:"#D0161B", fontWeight:700, textDecoration:"none" }}>
                zangoshotchicken.com
              </a>
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.2rem" }}>
            {stats.map(({ value, label }) => (
              <div key={label} style={{
                background:"#fff", border:"1.5px solid rgba(249,115,22,0.2)",
                borderRadius:"1rem", padding:"2rem 1.5rem", textAlign:"center",
                transition:"border-color 0.3s, transform 0.3s, box-shadow 0.3s",
                boxShadow:"0 4px 16px rgba(249,115,22,0.08)",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#F97316"; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(249,115,22,0.18)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(249,115,22,0.2)"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 16px rgba(249,115,22,0.08)"; }}
              >
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"3.5rem", color:"#D0161B", lineHeight:1, marginBottom:"0.4rem" }}>{value}</div>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:"0.7rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#92400e" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.about-grid{grid-template-columns:1fr !important;gap:3rem !important}}`}</style>
    </section>
  );
}