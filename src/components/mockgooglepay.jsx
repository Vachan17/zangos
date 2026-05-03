import { useState, useEffect } from "react";

export default function MockGooglePay({ amount, onSuccess, onClose }) {
  const [step, setStep] = useState("confirm"); // "confirm" -> "processing" -> "success"

  useEffect(() => {
    if (step === "processing") {
      const timer = setTimeout(() => {
        setStep("success");
      }, 2500);
      return () => clearTimeout(timer);
    }
    if (step === "success") {
      const timer = setTimeout(() => {
        onSuccess("gpay_txn_" + Math.floor(Math.random() * 1000000000));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, onSuccess]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 4000,
      background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
      fontFamily: "'Inter', 'Barlow', sans-serif"
    }}>
      <style>{`
        @keyframes slideUp { from{transform:translateY(30px);opacity:0} to{transform:none;opacity:1} }
        @keyframes spin { 100%{transform:rotate(360deg)} }
        @keyframes checkmark { 0%{stroke-dashoffset: 50} 100%{stroke-dashoffset: 0} }
      `}</style>

      <div style={{
        background: "#111", border: "1px solid #333",
        borderRadius: "1.2rem", width: "100%", maxWidth: 360,
        padding: "2rem", textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative"
      }}>
        {/* Close Button */}
        {step === "confirm" && (
          <button onClick={onClose} style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "transparent", border: "none", color: "#666",
            fontSize: "1.2rem", cursor: "pointer", padding: "0.5rem"
          }}>✕</button>
        )}

        {/* GPay Logo text mock */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem",
          fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "1.5rem",
          letterSpacing: "-0.05em"
        }}>
          <span style={{color: "#4285F4"}}>G</span>
          <span style={{color: "#5F6368"}}>Pay</span>
        </div>

        {step === "confirm" && (
          <div style={{ animation: "slideUp 0.3s ease" }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "#D0161B", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", margin: "0 auto 1rem",
              fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em"
            }}>Z</div>
            <p style={{ color: "#aaa", fontSize: "0.85rem", marginBottom: "0.2rem" }}>Paying Zangos</p>
            <h2 style={{ color: "#fff", fontSize: "2rem", fontWeight: 600, marginBottom: "2rem" }}>
              ₹{amount}
            </h2>
            <button
              onClick={() => setStep("processing")}
              style={{
                width: "100%", background: "#4285F4", color: "#fff",
                border: "none", borderRadius: "2rem", padding: "1rem",
                fontSize: "1rem", fontWeight: 600, cursor: "pointer",
                boxShadow: "0 4px 12px rgba(66,133,244,0.3)", transition: "all 0.2s"
              }}
            >
              Proceed to Pay
            </button>
          </div>
        )}

        {step === "processing" && (
          <div style={{ padding: "2rem 0", animation: "slideUp 0.3s ease" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              border: "3px solid #333", borderTopColor: "#4285F4",
              margin: "0 auto 1.5rem", animation: "spin 1s linear infinite"
            }} />
            <p style={{ color: "#fff", fontSize: "1rem", fontWeight: 500 }}>Processing Payment...</p>
            <p style={{ color: "#666", fontSize: "0.8rem", marginTop: "0.5rem" }}>Please do not close this window</p>
          </div>
        )}

        {step === "success" && (
          <div style={{ padding: "2rem 0", animation: "slideUp 0.3s ease" }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "#34A853", margin: "0 auto 1.5rem",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" style={{ strokeDasharray: 50, strokeDashoffset: 50, animation: "checkmark 0.5s ease forwards" }}></polyline>
              </svg>
            </div>
            <p style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600 }}>Payment Successful</p>
            <p style={{ color: "#aaa", fontSize: "0.85rem", marginTop: "0.5rem" }}>Redirecting back to order...</p>
          </div>
        )}
      </div>
    </div>
  );
}
