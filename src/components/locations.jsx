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
      }
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
        padding: "8rem 2rem",
        background: "#000",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "6rem" }}>
            <span style={{
              fontFamily: "'Barlow', sans-serif", fontWeight: 800,
              fontSize: "0.75rem", letterSpacing: "0.4em",
              textTransform: "uppercase", color: "#F97316",
              display: "block", marginBottom: "1rem",
            }}>
              EXPLORE
            </span>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              letterSpacing: "0.02em", color: "#fff", lineHeight: 0.9,
            }}>
              OUR LOCATIONS
            </h2>
          </div>

          {LOCATIONS.map((countryGroup, idx) => (
            <div key={idx} style={{ marginBottom: "5rem" }}>
              <div style={{ 
                display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" 
              }}>
                <h3 style={{ 
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", 
                  color: "#fff", letterSpacing: "0.1em", margin: 0 
                }}>
                  {countryGroup.country}
                </h3>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                gap: "2rem",
              }}>
                {countryGroup.branches.map((loc, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.02)",
                    border: loc.highlight ? "1px solid #F97316" : "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "0.5rem",
                    padding: "3rem",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.borderColor = "#F97316";
                      e.currentTarget.style.transform = "translateY(-5px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                      e.currentTarget.style.borderColor = loc.highlight ? "#F97316" : "rgba(255,255,255,0.05)";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    {loc.highlight && (
                      <div style={{
                        position: "absolute", top: 20, right: 20,
                        background: "#F97316", color: "#000",
                        fontFamily: "'Barlow', sans-serif", fontWeight: 900,
                        fontSize: "0.65rem", padding: "0.3rem 0.8rem",
                        borderRadius: "0.2rem", letterSpacing: "0.1em",
                        textTransform: "uppercase"
                      }}>Signature Branch</div>
                    )}

                    <h4 style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "2.2rem", letterSpacing: "0.05em",
                      color: "#fff", marginBottom: "1rem",
                    }}>
                      {loc.name.toUpperCase()}
                    </h4>

                    <p style={{
                      fontFamily: "'Barlow', sans-serif", fontSize: "0.95rem",
                      color: "#888", lineHeight: 1.6, marginBottom: "2rem",
                      minHeight: "3.2rem"
                    }}>
                      {loc.address}
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem" }}>
                      <div>
                        <div style={{ fontSize: "0.6rem", color: "#F97316", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.3rem", letterSpacing: "0.1em" }}>Hours</div>
                        <div style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 600 }}>{loc.hours}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.6rem", color: "#F97316", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.3rem", letterSpacing: "0.1em" }}>Connect</div>
                        <div style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 600 }}>{loc.phone}</div>
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