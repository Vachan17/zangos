const LOCATIONS = [
  {
    name: "Zangos Koramangala",
    address: "80 Feet Road, Koramangala 4th Block, Bengaluru",
    hours: "11:00 AM – 11:00 PM",
    phone: "+91 98765 43210",
    tag: "Flagship",
  },
  {
    name: "Zangos Indiranagar",
    address: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru",
    hours: "11:00 AM – 11:00 PM",
    phone: "+91 98765 43211",
    tag: "New",
  },
  {
    name: "Zangos JP Nagar",
    address: "24th Main Road, JP Nagar 6th Phase, Bengaluru",
    hours: "11:00 AM – 10:30 PM",
    phone: "+91 98765 43212",
    tag: "",
  },
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
        background: "var(--black)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{
              fontFamily: "var(--font-body)", fontWeight: 700,
              fontSize: "0.7rem", letterSpacing: "0.3em",
              textTransform: "uppercase", color: "var(--red)",
              display: "block", marginBottom: "0.7rem",
            }}>
              — FIND US —
            </span>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              letterSpacing: "0.06em", color: "var(--white)", lineHeight: 1,
            }}>
              OUR LOCATIONS
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}>
            {LOCATIONS.map((loc, i) => (
              <div key={i} style={{
                background: "linear-gradient(145deg, #1a1a1a, #121212)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1rem",
                padding: "2rem",
                transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
                position: "relative",
                overflow: "hidden",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(208,22,27,0.4)";
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 16px 40px rgba(208,22,27,0.12)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Decorative corner */}
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: 80, height: 80,
                  background: "radial-gradient(circle at top right, rgba(208,22,27,0.1), transparent 70%)",
                }} />

                {loc.tag && (
                  <span style={{
                    display: "inline-block",
                    background: "var(--red)", color: "#fff",
                    fontFamily: "var(--font-body)", fontWeight: 800,
                    fontSize: "0.6rem", letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "0.2rem 0.7rem", borderRadius: "2rem",
                    marginBottom: "1rem",
                  }}>{loc.tag}</span>
                )}

                <div style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>📍</div>
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.4rem", letterSpacing: "0.06em",
                  color: "var(--white)", marginBottom: "0.8rem",
                }}>
                  {loc.name.toUpperCase()}
                </h3>

                <p style={{
                  fontFamily: "var(--font-body)", fontSize: "0.85rem",
                  color: "#888", lineHeight: 1.6, marginBottom: "1.2rem",
                }}>
                  {loc.address}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <div style={{ fontSize: "0.8rem", color: "#999", fontFamily: "var(--font-body)" }}>
                    🕐 {loc.hours}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#999", fontFamily: "var(--font-body)" }}>
                    📞 {loc.phone}
                  </div>
                </div>

                <button style={{
                  marginTop: "1.5rem",
                  background: "transparent",
                  border: "1px solid rgba(208,22,27,0.4)",
                  color: "var(--red)",
                  fontFamily: "var(--font-body)", fontWeight: 700,
                  fontSize: "0.72rem", letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.5rem 1.2rem", borderRadius: "0.3rem",
                  cursor: "pointer", width: "100%",
                  transition: "background 0.2s, color 0.2s",
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "var(--red)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--red)";
                  }}
                  onClick={() => window.open(`https://maps.google.com?q=${encodeURIComponent(loc.address)}`, "_blank")}
                >
                  Get Directions →
                </button>
              </div>
            ))}
          </div>
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
            Follow us @zangos_ka.india · www.zangoshotchicken.com
          </p>
        </div>
      </section>
    </>
  );
}