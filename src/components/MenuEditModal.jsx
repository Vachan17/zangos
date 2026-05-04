import { useState, useEffect } from "react";
import { API_BASE } from "../config";

export default function MenuEditModal({ item, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Fried Chicken",
    description: "",
    image: "",
    variants: [{ label: "Regular", price: 0, includes: "" }],
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        variants: item.variants || [{ label: "Regular", price: 0, includes: "" }],
        tags: item.tags || []
      });
    }
  }, [item]);

  const handleVariantChange = (index, field, value) => {
    const next = [...formData.variants];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, variants: next });
  };

  const addVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { label: "", price: 0, includes: "" }] });
  };

  const removeVariant = (index) => {
    setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = item ? `${API_BASE}/api/menu/${item._id}` : `${API_BASE}/api/menu`;
      const method = item ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save menu item");
      onSave();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inpStyle = {
    width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1.5px solid rgba(249,115,22,0.2)",
    fontFamily: "'Barlow', sans-serif", outline: "none", marginBottom: "1rem"
  };

  const labelStyle = {
    display: "block", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase",
    color: "#92400e", marginBottom: "0.4rem", letterSpacing: "0.1em"
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(28,10,0,0.6)", backdropFilter: "blur(8px)", padding: "1rem"
    }}>
      <div style={{
        background: "#fff", width: "100%", maxWidth: 600, borderRadius: "1.5rem", maxHeight: "90vh",
        overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.3)", position: "relative",
        animation: "modalFadeIn 0.3s ease"
      }}>
        <div style={{
          padding: "2rem", background: "linear-gradient(135deg, #D0161B, #F97316)", color: "#fff",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.05em" }}>
            {item ? "EDIT MENU ITEM" : "ADD NEW ITEM"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Product Name</label>
              <input required style={inpStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Zangos Special" />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={inpStyle} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                {["Fried Chicken", "Tenders", "Wings", "Burgers", "Wraps", "French Fries"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inpStyle, height: 80, resize: "none" }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

          <label style={labelStyle}>Image URL (Unsplash or direct link)</label>
          <input style={inpStyle} value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />

          <div style={{ marginTop: "1rem", borderTop: "1px solid #eee", paddingTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Price Variants</label>
              <button type="button" onClick={addVariant} style={{ background: "#F97316", color: "#fff", border: "none", borderRadius: "0.3rem", padding: "0.3rem 0.8rem", fontSize: "0.7rem", fontWeight: 800, cursor: "pointer" }}>+ ADD VARIANT</button>
            </div>
            {formData.variants.map((v, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 100px 1fr 40px", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "end" }}>
                <div>
                  <label style={{ fontSize: "0.6rem", color: "#999" }}>Label (e.g. 2 PC)</label>
                  <input style={{ ...inpStyle, marginBottom: 0 }} value={v.label} onChange={e => handleVariantChange(i, "label", e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: "0.6rem", color: "#999" }}>Price</label>
                  <input type="number" style={{ ...inpStyle, marginBottom: 0 }} value={v.price} onChange={e => handleVariantChange(i, "price", parseInt(e.target.value))} />
                </div>
                <div>
                  <label style={{ fontSize: "0.6rem", color: "#999" }}>Includes</label>
                  <input style={{ ...inpStyle, marginBottom: 0 }} value={v.includes} onChange={e => handleVariantChange(i, "includes", e.target.value)} />
                </div>
                <button type="button" onClick={() => removeVariant(i)} style={{ background: "none", border: "none", color: "#D0161B", cursor: "pointer", paddingBottom: "0.8rem" }}>✕</button>
              </div>
            ))}
          </div>

          {error && <div style={{ color: "#D0161B", fontSize: "0.8rem", marginTop: "1rem" }}>⚠ {error}</div>}

          <button disabled={loading} type="submit" style={{
            width: "100%", marginTop: "2rem", background: "linear-gradient(135deg, #D0161B, #F97316)",
            color: "#fff", border: "none", borderRadius: "0.5rem", padding: "1rem",
            fontFamily: "'Barlow', sans-serif", fontWeight: 800, fontSize: "1rem", letterSpacing: "0.1em",
            cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 10px 30px rgba(208,22,27,0.3)"
          }}>
            {loading ? "SAVING..." : "SAVE CHANGES"}
          </button>
        </form>
      </div>
      <style>{`
        @keyframes modalFadeIn { from{opacity:0; transform:translateY(30px)} to{opacity:1; transform:none} }
      `}</style>
    </div>
  );
}
