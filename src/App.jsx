import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Navbar        from "./components/Navbar";
import Hero          from "./hero";
import MenuSection   from "./components/MenuSection";
import About         from "./components/about";
import Locations     from "./components/locations";
import Footer        from "./components/Footer";
import Cart          from "./components/cart";
import OrderModal    from "./components/ordermodal";
import OrderSuccess  from "./components/ordersuccess";
import OrderHistory  from "./components/orderhistory";
import AuthModal     from "./components/authmodal";
import EmployeeDashboard from "./components/employeedashboard";
import { API_BASE, SOCKET_URL } from "./config";
import "./index.css";

const CATEGORIES = ["All","Fried Chicken","Tenders","Wings","Burgers","Wraps","French Fries"];

const MENU_DATA = [
  { _id:"1",  name:"Old Town Fried Chicken",   category:"Fried Chicken", description:"2 Juicy chicken legs, classic crispy coating with secret spice blend",       variants:[{label:"2 PC",     price:299,includes:"French Fries, Ketchup, 1 Bun & 2 Dip"}],                                                                   tags:["Signature"] },
  { _id:"2",  name:"Signature Fried Chicken",  category:"Fried Chicken", description:"Our classic crispy fried chicken — perfectly seasoned and golden fried",      variants:[{label:"2 PC",     price:239,includes:"French Fries, Ketchup, 1 Bun & 1 Dip"},{label:"4 PC",price:389,includes:"French Fries, Ketchup, 2 Bun & 2 Dip"}], tags:["Bestseller"] },
  { _id:"3",  name:"Nashville Hot Chicken",    category:"Fried Chicken", description:"Fiery Nashville-style hot chicken. Available in Nashville Hot or X Hot",      variants:[{label:"2 PC",     price:259,includes:"French Fries, Ketchup, 1 Bun & 1 Dip"},{label:"4 PC",price:399,includes:"French Fries, Ketchup, 2 Bun & 2 Dip"}], tags:["Nashville Hot","Spicy"] },
  { _id:"4",  name:"Crispy Chicken Tenders",   category:"Tenders",       description:"Golden crispy tenders with your choice of dip",                               variants:[{label:"2 PC",     price:239,includes:"French Fries, Ketchup, 1 Bun & 1 Dip"},{label:"4 PC",price:459,includes:"French Fries, Ketchup, 2 Bun & 2 Dip"}], tags:[] },
  { _id:"5",  name:"Nashville Hot Tenders",    category:"Tenders",       description:"Tenders with Nashville Hot or X Hot seasoning",                               variants:[{label:"2 PC",     price:259,includes:"French Fries, Ketchup, 1 Bun & 1 Dip"},{label:"4 PC",price:489,includes:"French Fries, Ketchup, 2 Bun & 2 Dip"}], tags:["Nashville Hot","Spicy"] },
  { _id:"6",  name:"Original Wings",           category:"Wings",         description:"Juicy original wings — 5 pcs, crispy skin with tender meat inside",          variants:[{label:"5 PC",     price:199}], tags:[] },
  { _id:"7",  name:"Nashville Hot Wings",      category:"Wings",         description:"Spicy Nashville Hot or X Hot wings — 5 pcs",                                 variants:[{label:"5 PC",     price:219}], tags:["Nashville Hot","Spicy"] },
  { _id:"8",  name:"Delight Veg Burger",       category:"Burgers",       description:"Crispy veg patty in a soft bun",                                              variants:[{label:"Single",   price:119}], tags:["Veg"] },
  { _id:"9",  name:"Crispy Chicken Burger",    category:"Burgers",       description:"Available in Signature, Peppery, Tandoori or Nashville style",                variants:[{label:"Signature",price:189},{label:"Peppery",price:199},{label:"Tandoori",price:199},{label:"Nashville",price:199}], tags:["Bestseller"] },
  { _id:"10", name:"Crispy Chicken Wrap",      category:"Wraps",         description:"Crispy chicken in a toasted wrap",                                            variants:[{label:"Signature",price:199},{label:"Peppery",price:199},{label:"Tandoori",price:199},{label:"Nashville",price:219}], tags:[] },
  { _id:"11", name:"Falafel Wrap",             category:"Wraps",         description:"Crispy falafel in a soft wrap with fresh veggies",                            variants:[{label:"Single",   price:169}], tags:["Veg"] },
  { _id:"12", name:"Classic French Fries",     category:"French Fries",  description:"Golden salted classic fries",                                                 variants:[{label:"Regular",  price:109}], tags:[] },
  { _id:"13", name:"Spicy Hot French Fries",   category:"French Fries",  description:"Fries with a spicy Nashville kick",                                           variants:[{label:"Regular",  price:119}], tags:["Spicy"] },
  { _id:"14", name:"Cheesy French Fries",      category:"French Fries",  description:"Fries smothered in melted cheese",                                            variants:[{label:"Regular",  price:149}], tags:[] },
  { _id:"15", name:"Chicken Loaded Fries",     category:"French Fries",  description:"Fries piled high with crispy chicken, sauce & toppings",                     variants:[{label:"Regular",  price:249}], tags:["Bestseller"] },
];

function CustomerApp({ initialUser }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart,           setCart]           = useState([]);
  const [cartOpen,       setCartOpen]       = useState(false);
  const [checkoutOpen,   setCheckoutOpen]   = useState(false);
  const [successOrder,   setSuccessOrder]   = useState(null);
  const [orderHistory,   setOrderHistory]   = useState([]);
  const [historyOpen,    setHistoryOpen]    = useState(false);
  const [authOpen,       setAuthOpen]       = useState(false);
  const [user,           setUser]           = useState(initialUser || null);
  const [menuItems,      setMenuItems]      = useState([]);
  const [loadingMenu,    setLoadingMenu]    = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/menu`)
      .then(res => res.json())
      .then(data => {
        setMenuItems(data.length > 0 ? data : MENU_DATA);
        setLoadingMenu(false);
      })
      .catch(() => {
        setMenuItems(MENU_DATA);
        setLoadingMenu(false);
      });
  }, []);

  const refreshMenu = () => {
    setLoadingMenu(true);
    fetch(`${API_BASE}/api/menu`)
      .then(res => res.json())
      .then(data => { setMenuItems(data); setLoadingMenu(false); });
  };

  const logout = () => {
    localStorage.removeItem("zangos_token");
    localStorage.removeItem("zangos_user");
    setUser(null);
    setOrderHistory([]);
  };

  const [toast, setToast] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_URL ?? undefined, { transports: ["websocket"] });
    socket.on("order_updated", ({ orderId, orderNumber, status }) => {
      setOrderHistory(prev => {
        const idx = prev.findIndex(o => (o._id === orderId) || (o.orderId === orderId));
        if (idx === -1) return prev; // Not this customer's order
        
        // Show toast
        const statusMap = {
          confirmed: "Confirmed! We've received your order.",
          preparing: "Preparing! Our chefs are on it.",
          ready: "Ready! It's piping hot and waiting.",
          delivered: "Delivered! Enjoy your meal.",
          cancelled: "Cancelled. We're sorry for the inconvenience."
        };
        if (statusMap[status]) {
          setToast({ title: `Order ${orderNumber || ""}`, message: statusMap[status] });
          setTimeout(() => setToast(null), 5000);
        }

        const next = [...prev];
        next[idx] = { ...next[idx], status };
        return next;
      });
    });
    return () => socket.disconnect();
  }, []);

  const filtered = activeCategory === "All"
    ? menuItems
    : menuItems.filter(i => i.category === activeCategory);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (item, variant) => {
    setCart(prev => {
      const idx = prev.findIndex(c => c.name === item.name && c.variant === variant.label);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { name: item.name, variant: variant.label, price: variant.price, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (idx) => setCart(prev => prev.filter((_, i) => i !== idx));
  const changeQty = (idx, qty) => {
    if (qty <= 0) { removeFromCart(idx); return; }
    setCart(prev => prev.map((item, i) => i === idx ? { ...item, qty } : item));
  };

  const handleSuccess = (order) => {
    setOrderHistory(prev => [...prev, order]);
    setCart([]);
    setCartOpen(false);
    setCheckoutOpen(false);
    setSuccessOrder(order);
  };

  return (
    <div className="app">
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(o => !o)}
        orderCount={orderHistory.length}
        onHistoryClick={() => setHistoryOpen(true)}
        user={user}
        onAuthClick={() => setAuthOpen(true)}
        onLogout={logout}
      />
      <Hero />
      <MenuSection
        items={filtered} categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        loading={loadingMenu} onAddToCart={addToCart}
        user={user} onMenuUpdate={refreshMenu}
      />
      <About />
      <Locations onOrderNow={() => document.getElementById("menu")?.scrollIntoView({ behavior:"smooth" })} />
      <Footer />

      {/* Floating cart bubble */}
      {cartCount > 0 && !cartOpen && (
        <button onClick={() => setCartOpen(true)} style={{
          position:"fixed", bottom:"2rem", right:"2rem", zIndex:1500,
          background:"#D0161B", color:"#fff", border:"none",
          borderRadius:"2rem", padding:"0.85rem 1.4rem",
          fontFamily:"'Barlow',sans-serif", fontWeight:800,
          fontSize:"0.85rem", letterSpacing:"0.08em",
          cursor:"pointer", display:"flex", alignItems:"center", gap:"0.6rem",
          boxShadow:"0 8px 28px rgba(208,22,27,0.4)",
          animation:"cartBounce 2s ease-in-out infinite",
        }}>
          🛒 View Order
          <span style={{ background:"#fff", color:"#D0161B", borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:900 }}>{cartCount}</span>
        </button>
      )}

      {cartOpen && <div onClick={() => setCartOpen(false)} style={{ position:"fixed", inset:0, zIndex:1999, background:"rgba(28,10,0,0.45)", backdropFilter:"blur(4px)" }} />}
      {cartOpen && <Cart cart={cart} onRemove={removeFromCart} onQtyChange={changeQty} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} onClose={() => setCartOpen(false)} />}

      {checkoutOpen && <OrderModal cart={cart} user={user} onClose={() => setCheckoutOpen(false)} onSuccess={handleSuccess} />}
      {successOrder  && <OrderSuccess order={successOrder} onClose={() => setSuccessOrder(null)} />}
      {historyOpen   && <OrderHistory orders={orderHistory} onClose={() => setHistoryOpen(false)} />}
      {authOpen      && <AuthModal onClose={() => setAuthOpen(false)} onLogin={setUser} />}

      {/* Customer Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", zIndex: 5000,
          background: "#fff", borderLeft: "4px solid #D0161B", borderRadius: "0.5rem",
          padding: "1rem 1.5rem", boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          animation: "toastSlideDown 0.3s ease-out", display: "flex", gap: "1rem", alignItems: "center"
        }}>
          <div style={{ fontSize: "1.5rem" }}>🔥</div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: "#111", letterSpacing: "0.05em" }}>{toast.title}</div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.9rem", color: "#555", fontWeight: 600 }}>{toast.message}</div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes cartBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes toastSlideDown { from{transform:translate(-50%,-20px);opacity:0} to{transform:translate(-50%,0);opacity:1} }
      `}</style>
    </div>
  );
}

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");

  const inp = (f) => ({
    width: "100%", padding: "0.85rem 1rem",
    background: "#FFF7ED",
    border: `1.5px solid ${focused === f ? "#F97316" : "rgba(249,115,22,0.25)"}`,
    borderRadius: "0.5rem", color: "#1c0a00",
    fontFamily: "'Barlow',sans-serif", fontSize: "0.92rem",
    outline: "none", transition: "border-color 0.2s",
  });

  const submit = async () => {
    setError("");
    if (!email || !password) { setError("Email and password are required."); return; }
    if (mode === "signup" && !name) { setError("Please enter your name."); return; }
    setLoading(true);
    try {
      const endpointMap = { signin: "login", signup: "register" };
      const res = await fetch(`${API_BASE}/api/auth/${endpointMap[mode]}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      localStorage.setItem("zangos_token", data.token);
      localStorage.setItem("zangos_user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#FFFBF5",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Barlow',sans-serif", padding: "1rem",
      backgroundImage: "radial-gradient(circle at 20% 50%, rgba(208,22,27,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(249,115,22,0.08) 0%, transparent 50%)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700;800;900&display=swap');
        @keyframes authFadeIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 440,
        background: "#fff",
        borderRadius: "1.5rem",
        border: "1.5px solid rgba(249,115,22,0.2)",
        boxShadow: "0 32px 80px rgba(208,22,27,0.12), 0 8px 24px rgba(0,0,0,0.06)",
        overflow: "hidden",
        animation: "authFadeIn 0.4s ease",
      }}>
        {/* Brand Header */}
        <div style={{
          background: "linear-gradient(135deg, #D0161B 0%, #F97316 100%)",
          padding: "2rem 2rem 1.5rem",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.8rem",
            letterSpacing: "0.12em", color: "#fff",
            textShadow: "0 2px 12px rgba(0,0,0,0.25)",
          }}>ZANGOS</div>
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            {mode === "signin" ? "Welcome Back 🔥" : "Join the Family 🔥"}
          </div>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: "flex", background: "#FFF7ED", margin: "1.5rem 1.8rem 0", borderRadius: "0.6rem", padding: "0.25rem", border: "1px solid rgba(249,115,22,0.2)" }}>
          {["signin","signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
              flex: 1, padding: "0.6rem",
              background: mode === m ? "#D0161B" : "transparent",
              border: "none", borderRadius: "0.45rem",
              color: mode === m ? "#fff" : "#92400e",
              fontFamily: "'Barlow',sans-serif", fontWeight: 800,
              fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.2s",
            }}>
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ padding: "1.4rem 1.8rem 2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {mode === "signup" && (
              <div>
                <label style={{ display:"block", fontSize:"0.68rem", fontWeight:800, letterSpacing:"0.1em", color:"#92400e", textTransform:"uppercase", marginBottom:"0.35rem" }}>Full Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Arjun Sharma"
                  onFocus={() => setFocused("name")} onBlur={() => setFocused("")} style={inp("name")} />
              </div>
            )}
            <div>
              <label style={{ display:"block", fontSize:"0.68rem", fontWeight:800, letterSpacing:"0.1em", color:"#92400e", textTransform:"uppercase", marginBottom:"0.35rem" }}>Email *</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
                onFocus={() => setFocused("email")} onBlur={() => setFocused("")} style={inp("email")} />
            </div>
            {mode === "signup" && (
              <div>
                <label style={{ display:"block", fontSize:"0.68rem", fontWeight:800, letterSpacing:"0.1em", color:"#92400e", textTransform:"uppercase", marginBottom:"0.35rem" }}>Phone (optional)</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
                  onFocus={() => setFocused("phone")} onBlur={() => setFocused("")} style={inp("phone")} />
              </div>
            )}
            <div>
              <label style={{ display:"block", fontSize:"0.68rem", fontWeight:800, letterSpacing:"0.1em", color:"#92400e", textTransform:"uppercase", marginBottom:"0.35rem" }}>Password *</label>
              <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" type="password"
                onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
                onKeyDown={e => e.key === "Enter" && submit()} style={inp("password")} />
            </div>
          </div>

          {error && (
            <div style={{ marginTop:"1rem", padding:"0.7rem 1rem", background:"rgba(208,22,27,0.07)", border:"1px solid rgba(208,22,27,0.25)", borderRadius:"0.5rem", color:"#D0161B", fontSize:"0.82rem", fontWeight:600 }}>
              ⚠ {error}
            </div>
          )}

          <button onClick={submit} disabled={loading} style={{
            width: "100%", marginTop: "1.2rem",
            background: loading ? "#ccc" : "linear-gradient(135deg, #D0161B, #F97316)",
            color: "#fff", border: "none", borderRadius: "0.5rem", padding: "1rem",
            fontFamily: "'Barlow',sans-serif", fontWeight: 800,
            fontSize: "0.92rem", letterSpacing: "0.1em", textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 8px 24px rgba(208,22,27,0.35)",
            transition: "all 0.2s",
          }}>
            {loading ? "Please wait..." : mode === "signin" ? "Sign In →" : "Create Account →"}
          </button>

          <p style={{ marginTop:"1rem", textAlign:"center", fontSize:"0.78rem", color:"#92400e" }}>
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setMode(m => m === "signin" ? "signup" : "signin"); setError(""); }} style={{
              background:"none", border:"none", color:"#D0161B", fontWeight:800, cursor:"pointer", fontSize:"0.78rem", padding:0,
            }}>
              {mode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("zangos_user");
    try { return saved ? JSON.parse(saved) : null; } catch { return null; }
  });

  useEffect(() => {
    const onHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleLogin = (u) => setUser(u);

  if (currentHash === "#/employee") return <EmployeeDashboard />;
  if (!user) return <AuthPage onLogin={handleLogin} />;
  return <CustomerApp initialUser={user} />;
}