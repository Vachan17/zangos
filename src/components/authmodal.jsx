import { useState } from "react";
import { API_BASE } from "../config";
const API_MAP = { signin: `${API_BASE}/api/auth/login`, signup: `${API_BASE}/api/auth/register` };

export default function AuthModal({ onClose, onLogin }) {
  const [mode,     setMode]     = useState("signin"); // "signin" | "signup"
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [focused,  setFocused]  = useState("");

  const inp = (f) => ({
    width: "100%", padding: "0.8rem 1rem",
    background: "#FFF7ED",
    border: `1.5px solid ${focused === f ? "#F97316" : "rgba(249,115,22,0.25)"}`,
    borderRadius: "0.4rem", color: "#1c0a00",
    fontFamily: "'Barlow',sans-serif", fontSize: "0.92rem",
    outline: "none", transition: "border-color 0.2s",
  });

  const submit = async () => {
    setError("");
    if (!email || !password) { setError("Email and password are required."); return; }
    if (mode === "signup" && !name) { setError("Please enter your name."); return; }
    setLoading(true);
    try {
      const res  = await fetch(API_MAP[mode], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      localStorage.setItem("zangos_token", data.token);
      localStorage.setItem("zangos_user",  JSON.stringify(data.user));
      onLogin(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === "signin" ? "signup" : "signin");
    setError("");
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 4000,
      background: "rgba(28,10,0,0.6)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
    }} onClick={e => e.target === e.currentTarget && onClose()}>

      <div style={{
        background: "#FFFBF5", borderRadius: "1.2rem",
        border: "2px solid rgba(249,115,22,0.3)",
        width: "100%", maxWidth: 420,
        boxShadow: "0 30px 80px rgba(249,115,22,0.2)",
        animation: "authPop 0.25s ease",
        overflow: "hidden",
      }}>
        <style>{`@keyframes authPop{from{transform:scale(0.92) translateY(20px);opacity:0}to{transform:none;opacity:1}}`}</style>

        {/* Header */}
        <div style={{
          padding: "1.5rem 1.8rem 1.2rem",
          background: "#FFF7ED",
          borderBottom: "1px solid rgba(249,115,22,0.15)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2rem", letterSpacing: "0.08em", color: "#1c0a00" }}>
              {mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#92400e", fontWeight: 600 }}>
              {mode === "signin" ? "Welcome back to Zangos 🔥" : "Join the Zangos family 🔥"}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)",
            color: "#92400e", fontSize: "1.1rem", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        <div style={{ padding: "1.5rem 1.8rem" }}>
          {/* Mode toggle */}
          <div style={{ display: "flex", background: "#FFF7ED", borderRadius: "0.5rem", padding: "0.25rem", marginBottom: "1.4rem", border: "1px solid rgba(249,115,22,0.2)" }}>
            {["signin","signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
                flex: 1, padding: "0.55rem",
                background: mode === m ? "#F97316" : "transparent",
                border: "none", borderRadius: "0.35rem",
                color: mode === m ? "#fff" : "#92400e",
                fontFamily: "'Barlow',sans-serif", fontWeight: 800,
                fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase",
                cursor: "pointer", transition: "all 0.2s",
              }}>
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {mode === "signup" && (
              <div>
                <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em", color: "#92400e", textTransform: "uppercase", marginBottom: "0.35rem" }}>Full Name *</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Arjun Sharma"
                  onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
                  style={inp("name")} />
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em", color: "#92400e", textTransform: "uppercase", marginBottom: "0.35rem" }}>Email *</label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" type="email"
                onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                style={inp("email")} />
            </div>

            {mode === "signup" && (
              <div>
                <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em", color: "#92400e", textTransform: "uppercase", marginBottom: "0.35rem" }}>Phone (optional)</label>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  onFocus={() => setFocused("phone")} onBlur={() => setFocused("")}
                  style={inp("phone")} />
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em", color: "#92400e", textTransform: "uppercase", marginBottom: "0.35rem" }}>Password *</label>
              <input value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters" type="password"
                onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
                onKeyDown={e => e.key === "Enter" && submit()}
                style={inp("password")} />
            </div>
          </div>

          {error && (
            <div style={{
              marginTop: "1rem", padding: "0.7rem 1rem",
              background: "rgba(208,22,27,0.07)", border: "1px solid rgba(208,22,27,0.25)",
              borderRadius: "0.4rem", color: "#D0161B",
              fontSize: "0.82rem", fontWeight: 600,
            }}>⚠ {error}</div>
          )}

          <button onClick={submit} disabled={loading} style={{
            width: "100%", marginTop: "1.2rem",
            background: loading ? "#ccc" : "#D0161B",
            color: "#fff", border: "none", borderRadius: "0.4rem", padding: "1rem",
            fontFamily: "'Barlow',sans-serif", fontWeight: 800,
            fontSize: "0.92rem", letterSpacing: "0.1em", textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 8px 24px rgba(208,22,27,0.35)",
          }}>
            {loading ? "Please wait..." : mode === "signin" ? "Sign In →" : "Create Account →"}
          </button>

          <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.78rem", color: "#92400e" }}>
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={switchMode} style={{
              background: "none", border: "none", color: "#D0161B",
              fontWeight: 800, cursor: "pointer", fontSize: "0.78rem", padding: 0,
            }}>
              {mode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}