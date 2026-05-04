const LOCATIONS = [
  {
    country: "INDIA",
    branches: [
      {
        name: "Zangos Mangalore",
        address: "Bejai, Mangalore, Karnataka 575004",
        hours: "11:00 AM – 11:00 PM",
        phone: "+91 91136 67554",
        tag: "MAIN BRANCH",
        highlight: true,
      },
      {
        name: "Zangos Bengaluru",
        address: "Koramangala 4th Block, Bengaluru",
        hours: "11:00 AM – 11:00 PM",
        phone: "+91 98765 43210",
        tag: "",
      },
    ]
  },
  {
    country: "INDONESIA",
    branches: [
      {
        name: "Zangos Jakarta",
        address: "Jakarta South, Indonesia",
        hours: "10:00 AM – 10:00 PM",
        phone: "+62 812 3456 789",
        tag: "International",
      },
    ]
  },
  {
    country: "SAUDI ARABIA",
    branches: [
      {
        name: "Zangos Riyadh",
        address: "Riyadh, Saudi Arabia",
        hours: "COMING SOON",
        phone: "-",
        tag: "SOON",
      },
    ]
  }
];

const ORDER_APPS = [
  { name: "Swiggy", emoji: "🟠", color: "#FF5200" },
  { name: "Zomato", emoji: "🔴", color: "#E23744" },
  { name: "Direct", emoji: "📞", color: "#D0161B" },
];

export default function Locations() {
  return (
    <>
      {/* LOCATIONS */}
      <section id="locations" style={{
        padding: "7rem 2rem",
        background: "#000",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span style={{
              fontFamily: "var(--font-body)", fontWeight: 800,
              fontSize: "0.7rem", letterSpacing: "0.35em",
              textTransform: "uppercase", color: "#F97316",
              display: "block", marginBottom: "0.8rem",
            }}>
              — GLOBAL PRESENCE —
            </span>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              letterSpacing: "0.05em", color: "#fff", lineHeight: 1,
            }}>
              OUR LOCATIONS
            </h2>
          </div>

          {LOCATIONS.map((countryGroup, idx) => (
            <div key={idx} style={{ marginBottom: "4rem" }}>
              <div style={{ 
                display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" 
              }}>
                <h3 style={{ 
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", 
                  color: "#fff", letterSpacing: "0.1em", margin: 0 
                }}>
                  {countryGroup.country}
                </h3>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "1.5rem",
              }}>
                {countryGroup.branches.map((loc, i) => (
                  <div key={i} style={{
                    background: loc.highlight ? "linear-gradient(145deg, #2a0800, #121212)" : "linear-gradient(145deg, #161616, #0a0a0a)",
                    border: loc.highlight ? "2px solid #F97316" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "1.2rem",
                    padding: "2.5rem",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: loc.highlight ? "0 20px 50px rgba(249,115,22,0.15)" : "none",
                  }}
                    onMouseEnter={e => {
                      if (!loc.highlight) e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)";
                      e.currentTarget.style.transform = "translateY(-8px)";
                    }}
                    onMouseLeave={e => {
                      if (!loc.highlight) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    {loc.highlight && (
                      <div style={{
                        position: "absolute", top: 15, right: 15,
                        background: "#F97316", color: "#fff",
                        fontFamily: "'Barlow', sans-serif", fontWeight: 900,
                        fontSize: "0.6rem", padding: "0.25rem 0.7rem",
                        borderRadius: "2rem", letterSpacing: "0.1em"
                      }}>MAIN HUB</div>
                    )}

                    <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{loc.country === "SAUDI ARABIA" ? "⏳" : "📍"}</div>
                    <h4 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.6rem", letterSpacing: "0.05em",
                      color: "#fff", marginBottom: "0.8rem",
                    }}>
                      {loc.name.toUpperCase()}
                    </h4>

                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "0.9rem",
                      color: "#aaa", lineHeight: 1.6, marginBottom: "1.5rem",
                    }}>
                      {loc.address}
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
                      <div style={{ fontSize: "0.85rem", color: "#ddd", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                        <span style={{ color: "#F97316", marginRight: "0.5rem" }}>🕐</span> {loc.hours}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#ddd", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                        <span style={{ color: "#F97316", marginRight: "0.5rem" }}>📞</span> {loc.phone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ORDER NOW */}
      <section id="order-now" style={{
        padding: "7rem 2rem",
        background: `radial-gradient(ellipse at 50% 0%, rgba(208,22,27,0.15), transparent 60%), #0a0a0a`,
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <span style={{
            fontFamily: "var(--font-body)", fontWeight: 700,
            fontSize: "0.7rem", letterSpacing: "0.3em",
            textTransform: "uppercase", color: "var(--red)",
            display: "block", marginBottom: "0.7rem",
          }}>
            — HUNGRY? —
          </span>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            letterSpacing: "0.06em", color: "var(--white)",
            lineHeight: 1, marginBottom: "1rem",
          }}>
            ORDER NOW
          </h2>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "1rem",
            color: "#888", lineHeight: 1.7, marginBottom: "3rem",
          }}>
            Get hot, crispy Zangos delivered straight to your door.
            Order on your favourite platform below.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {ORDER_APPS.map(({ name, emoji, color }) => (
              <button key={name} style={{
                background: "linear-gradient(145deg, #1c1c1c, #141414)",
                border: `1px solid ${color}44`,
                color: "var(--white)",
                fontFamily: "var(--font-body)", fontWeight: 800,
                fontSize: "0.9rem", letterSpacing: "0.06em",
                padding: "1rem 2rem", borderRadius: "0.5rem",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "0.6rem",
                transition: "all 0.25s",
                boxShadow: `0 4px 20px ${color}22`,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = color;
                  e.currentTarget.style.boxShadow = `0 8px 30px ${color}55`;
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "linear-gradient(145deg, #1c1c1c, #141414)";
                  e.currentTarget.style.boxShadow = `0 4px 20px ${color}22`;
                  e.currentTarget.style.transform = "none";
                }}
              >
                <span>{emoji}</span> Order on {name}
              </button>
            ))}
          </div>

          <p style={{
            marginTop: "3rem",
            fontFamily: "var(--font-body)", fontSize: "0.75rem",
            color: "#555", letterSpacing: "0.05em",
          }}>
            Follow us @zangos.india · www.zangoshotchicken.com
          </p>
        </div>
      </section>
    </>
  );
}