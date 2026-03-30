import { useState, useEffect, useRef } from "react";

// ════════════════════════════════════════════════════════
//  QUIKMART  –  FULL APP  (Customer + Admin + Delivery)
//  Single file, role-based login
// ════════════════════════════════════════════════════════

const API = "const API = import.meta.env.VITE_API_URL //http://localhost:5000/api"; // ← change to your Render URL after deploy

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const PRODUCTS = [
    { _id: "1", name: "Fresh Bananas", weight: "6 pcs", price: 29, mrp: 40, emoji: "🍌", category: "fruits", badge: "25% OFF", tag: "bestseller" },
    { _id: "2", name: "Red Tomatoes", weight: "500 g", price: 18, mrp: 25, emoji: "🍅", category: "fruits", badge: "28% OFF" },
    { _id: "3", name: "Baby Spinach", weight: "200 g", price: 35, mrp: 45, emoji: "🥬", category: "fruits", badge: "22% OFF", tag: "organic" },
    { _id: "4", name: "Carrots Pack", weight: "500 g", price: 22, mrp: 30, emoji: "🥕", category: "fruits", badge: "27% OFF" },
    { _id: "5", name: "Green Apples", weight: "4 pcs", price: 89, mrp: 120, emoji: "🍏", category: "fruits", badge: "26% OFF", tag: "fresh" },
    { _id: "6", name: "Full Cream Milk", weight: "1 L", price: 68, mrp: 72, emoji: "🥛", category: "dairy", badge: "6% OFF", tag: "daily" },
    { _id: "7", name: "Farm Eggs", weight: "12 pcs", price: 89, mrp: 99, emoji: "🥚", category: "dairy", badge: "10% OFF", tag: "fresh" },
    { _id: "8", name: "Salted Butter", weight: "100 g", price: 55, mrp: 60, emoji: "🧈", category: "dairy", badge: "8% OFF" },
    { _id: "9", name: "Lay's Classic", weight: "90 g", price: 35, mrp: 40, emoji: "🥔", category: "snacks", badge: "12% OFF" },
    { _id: "10", name: "Dark Chocolate", weight: "100 g", price: 149, mrp: 180, emoji: "🍫", category: "snacks", badge: "17% OFF", tag: "premium" },
    { _id: "11", name: "Almonds", weight: "200 g", price: 199, mrp: 249, emoji: "🥜", category: "snacks", badge: "20% OFF", tag: "healthy" },
    { _id: "12", name: "Orange Juice", weight: "1 L", price: 99, mrp: 130, emoji: "🍊", category: "beverages", badge: "24% OFF" },
    { _id: "13", name: "Green Tea", weight: "25 bags", price: 125, mrp: 150, emoji: "🍵", category: "beverages", badge: "17% OFF", tag: "wellness" },
    { _id: "14", name: "Sparkling Water", weight: "500 ml", price: 45, mrp: 55, emoji: "💧", category: "beverages", badge: "18% OFF" },
    { _id: "15", name: "Multigrain Bread", weight: "400 g", price: 55, mrp: 65, emoji: "🍞", category: "bakery", badge: "15% OFF", tag: "fresh baked" },
    { _id: "16", name: "Croissants", weight: "4 pcs", price: 129, mrp: 160, emoji: "🥐", category: "bakery", badge: "19% OFF", tag: "fresh" },
    { _id: "17", name: "Chicken Breast", weight: "500 g", price: 189, mrp: 220, emoji: "🍗", category: "meat", badge: "14% OFF", tag: "fresh cut" },
    { _id: "18", name: "Prawns", weight: "250 g", price: 249, mrp: 299, emoji: "🦐", category: "meat", badge: "17% OFF", tag: "fresh" },
    { _id: "19", name: "Shampoo", weight: "200 ml", price: 179, mrp: 220, emoji: "🧴", category: "personal", badge: "19% OFF" },
    { _id: "20", name: "Dish Soap", weight: "500 ml", price: 89, mrp: 110, emoji: "🧼", category: "household", badge: "19% OFF" },
    { _id: "21", name: "Ice Cream", weight: "500 ml", price: 149, mrp: 180, emoji: "🍦", category: "frozen", badge: "17% OFF", tag: "bestseller" },
    { _id: "22", name: "Frozen Peas", weight: "500 g", price: 79, mrp: 99, emoji: "🫛", category: "frozen", badge: "20% OFF" },
];

const CATEGORIES = [
    { id: "all", label: "All", emoji: "🛒" },
    { id: "fruits", label: "Fruits & Veggies", emoji: "🥦" },
    { id: "dairy", label: "Dairy & Eggs", emoji: "🥛" },
    { id: "snacks", label: "Snacks", emoji: "🍿" },
    { id: "beverages", label: "Beverages", emoji: "🧃" },
    { id: "bakery", label: "Bakery", emoji: "🍞" },
    { id: "meat", label: "Meat & Fish", emoji: "🍗" },
    { id: "personal", label: "Personal Care", emoji: "🧴" },
    { id: "household", label: "Household", emoji: "🧹" },
    { id: "frozen", label: "Frozen", emoji: "🧊" },
];

const MOCK_ORDERS = [
    { id: "ORD001", customer: "Priya Sharma", phone: "+91 98765 43210", address: "Flat 4B, Green Residency, Koramangala", pincode: "560034", items: [{ name: "Fresh Bananas", qty: 2, price: 29, emoji: "🍌" }, { name: "Milk", qty: 1, price: 68, emoji: "🥛" }], total: 156, subtotal: 126, delivery: 29, taxes: 6, paymentMethod: "Card", paymentStatus: "paid", status: "placed", time: new Date(Date.now() - 2 * 60000) },
    { id: "ORD002", customer: "Rahul Mehta", phone: "+91 87654 32109", address: "No 12, Brigade Road, Indiranagar", pincode: "560008", items: [{ name: "Farm Eggs", qty: 1, price: 89, emoji: "🥚" }, { name: "Chocolate", qty: 2, price: 149, emoji: "🍫" }], total: 447, subtotal: 387, delivery: 0, taxes: 19, paymentMethod: "UPI", paymentStatus: "paid", status: "confirmed", time: new Date(Date.now() - 8 * 60000) },
    { id: "ORD003", customer: "Ananya Reddy", phone: "+91 76543 21098", address: "301, Maple Heights, Whitefield", pincode: "560066", items: [{ name: "Chicken", qty: 2, price: 189, emoji: "🍗" }, { name: "Spinach", qty: 1, price: 35, emoji: "🥬" }], total: 442, subtotal: 413, delivery: 0, taxes: 22, paymentMethod: "COD", paymentStatus: "pending", status: "packed", time: new Date(Date.now() - 15 * 60000) },
    { id: "ORD004", customer: "Kiran Patel", phone: "+91 65432 10987", address: "Flat 2A, Palm Grove, HSR Layout", pincode: "560102", items: [{ name: "OJ", qty: 3, price: 99, emoji: "🍊" }, { name: "Green Tea", qty: 1, price: 125, emoji: "🍵" }], total: 447, subtotal: 422, delivery: 0, taxes: 21, paymentMethod: "Card", paymentStatus: "paid", status: "dispatched", time: new Date(Date.now() - 22 * 60000) },
    { id: "ORD005", customer: "Sneha Kumar", phone: "+91 54321 09876", address: "No 8, 5th Cross, JP Nagar", pincode: "560078", items: [{ name: "Bread", qty: 2, price: 55, emoji: "🍞" }, { name: "Eggs", qty: 1, price: 89, emoji: "🥚" }], total: 283, subtotal: 254, delivery: 0, taxes: 13, paymentMethod: "UPI", paymentStatus: "paid", status: "delivered", time: new Date(Date.now() - 45 * 60000) },
    { id: "ORD006", customer: "Vikram Joshi", phone: "+91 21098 76543", address: "Flat 5C, Sobha Dream, Electronic City", pincode: "560100", items: [{ name: "Apples", qty: 2, price: 89, emoji: "🍏" }, { name: "Carrots", qty: 3, price: 22, emoji: "🥕" }], total: 310, subtotal: 279, delivery: 0, taxes: 14, paymentMethod: "UPI", paymentStatus: "paid", status: "placed", time: new Date(Date.now() - 1 * 60000) },
    { id: "ORD007", customer: "Divya Nair", phone: "+91 32109 87654", address: "14, 3rd Block, Rajajinagar", pincode: "560010", items: [{ name: "Shampoo", qty: 1, price: 179, emoji: "🧴" }, { name: "Soap", qty: 2, price: 89, emoji: "🧼" }], total: 386, subtotal: 357, delivery: 0, taxes: 18, paymentMethod: "COD", paymentStatus: "pending", status: "confirmed", time: new Date(Date.now() - 5 * 60000) },
];

const TAG_COLORS = {
    bestseller: { bg: "#FEF9C3", color: "#A16207" }, organic: { bg: "#DCFCE7", color: "#166534" },
    fresh: { bg: "#DBEAFE", color: "#1D4ED8" }, healthy: { bg: "#FCE7F3", color: "#9D174D" },
    premium: { bg: "#EDE9FE", color: "#5B21B6" }, daily: { bg: "#FEF3C7", color: "#92400E" },
    wellness: { bg: "#ECFDF5", color: "#065F46" }, "fresh baked": { bg: "#FEF9C3", color: "#A16207" },
    "fresh cut": { bg: "#FEF2F2", color: "#991B1B" },
};

const STATUS_CFG = {
    placed: { color: "#3B82F6", bg: "#EFF6FF", label: "Placed", icon: "📋" },
    confirmed: { color: "#8B5CF6", bg: "#EDE9FE", label: "Confirmed", icon: "✅" },
    packed: { color: "#F59E0B", bg: "#FEF3C7", label: "Packed", icon: "📦" },
    dispatched: { color: "#F97316", bg: "#FFF7ED", label: "On the Way", icon: "🛵" },
    delivered: { color: "#10B981", bg: "#ECFDF5", label: "Delivered", icon: "🎉" },
    cancelled: { color: "#EF4444", bg: "#FEF2F2", label: "Cancelled", icon: "❌" },
};
const PAY_CFG = {
    paid: { color: "#10B981", bg: "#ECFDF5", label: "Paid" },
    pending: { color: "#F59E0B", bg: "#FEF3C7", label: "Pending" },
    failed: { color: "#EF4444", bg: "#FEF2F2", label: "Failed" },
};

const timeSince = (d) => {
    const m = Math.floor((Date.now() - new Date(d)) / 60000);
    if (m < 1) return "Just now"; if (m < 60) return `${m}m ago`;
    return `${Math.floor(m / 60)}h ago`;
};

// ════════════════════════════════════════════════════════
//  ROOT – Role Gate
// ════════════════════════════════════════════════════════
export default function QuikMartApp() {
    const [role, setRole] = useState(null); // null | customer | admin | delivery
    const [orders, setOrders] = useState(MOCK_ORDERS);

    if (!role) return <RoleSelect onSelect={setRole} />;
    if (role === "customer") return <CustomerApp onExit={() => setRole(null)} orders={orders} setOrders={setOrders} />;
    if (role === "admin") return <AdminApp onExit={() => setRole(null)} orders={orders} setOrders={setOrders} />;
    if (role === "delivery") return <DeliveryApp onExit={() => setRole(null)} orders={orders} setOrders={setOrders} />;
}

// ════════════════════════════════════════════════════════
//  ROLE SELECT SCREEN
// ════════════════════════════════════════════════════════
function RoleSelect({ onSelect }) {
    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0F1117 0%,#1A1F2E 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito',sans-serif", padding: 24 }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Sora:wght@600;700;800&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} .rcard{transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s;cursor:pointer;} .rcard:hover{transform:translateY(-6px);} .ri{animation:ri 0.6s cubic-bezier(0.34,1.56,0.64,1) both;} @keyframes ri{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}`}</style>
            <div className="ri" style={{ textAlign: "center", marginBottom: 40 }}>
                <div style={{ width: 80, height: 80, borderRadius: 24, background: "linear-gradient(135deg,#7C3AED,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 16px", boxShadow: "0 16px 40px rgba(124,58,237,0.4)" }}>⚡</div>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 32, color: "#F1F5F9", letterSpacing: "-0.03em" }}>QuikMart</div>
                <div style={{ fontSize: 14, color: "#475569", marginTop: 6 }}>Who are you today?</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, width: "100%", maxWidth: 720 }}>
                {[
                    { role: "customer", icon: "🛒", title: "Customer", sub: "Browse & order groceries", grad: "linear-gradient(135deg,#7C3AED,#A855F7)", delay: "0s" },
                    { role: "admin", icon: "📊", title: "Admin", sub: "Manage orders & products", grad: "linear-gradient(135deg,#0F766E,#10B981)", delay: "0.1s" },
                ].map(({ role, icon, title, sub, grad, delay }) => (
                    <div key={role} className="rcard ri" onClick={() => onSelect(role)} style={{ background: "#161B27", border: "1px solid #1E2535", borderRadius: 20, padding: "28px 24px", cursor: "pointer", animationDelay: delay }}>
                        <div style={{ width: 60, height: 60, borderRadius: 18, background: grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 16, boxShadow: `0 8px 24px rgba(0,0,0,0.3)` }}>{icon}</div>
                        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: "#F1F5F9", marginBottom: 6 }}>{title}</div>
                        <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{sub}</div>
                        <div style={{ marginTop: 16, fontSize: 13, fontWeight: 700, color: "#818CF8" }}>Enter →</div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 32, fontSize: 12, color: "#334155" }}>QuikMart v1.0 · Groceries in 10 minutes</div>
        </div>
    );
}

// ════════════════════════════════════════════════════════
//  CUSTOMER APP
// ════════════════════════════════════════════════════════
function CustomerApp({ onExit, orders, setOrders }) {
    const [user, setUser] = useState(null);
    const [screen, setScreen] = useState("auth"); // auth|home|tracking|orderslist|profile
    const [cart, setCart] = useState({});
    const [cartOpen, setCartOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [activeOrder, setActiveOrder] = useState(null);
    const [search, setSearch] = useState("");
    const [activeCat, setActiveCat] = useState("all");
    const [toast, setToast] = useState("");
    const [activeBanner, setActiveBanner] = useState(0);
    const [countdown, setCountdown] = useState(600);

    const BANNERS = [
        { title: "Delivered in 10 Minutes", sub: "Fresh groceries, lightning fast", emoji: "⚡", bg: "linear-gradient(135deg,#7C3AED,#A855F7)" },
        { title: "50% OFF on Fruits", sub: "Farm fresh, direct to you", emoji: "🥦", bg: "linear-gradient(135deg,#059669,#10B981)" },
        { title: "Free Delivery Today", sub: "On orders above ₹199", emoji: "🚀", bg: "linear-gradient(135deg,#DC2626,#EF4444)" },
    ];

    useEffect(() => { const t = setInterval(() => setActiveBanner(b => (b + 1) % BANNERS.length), 3500); return () => clearInterval(t); }, []);
    useEffect(() => { const t = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 600), 1000); return () => clearInterval(t); }, []);

    const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 2200); };
    const addToCart = (p) => { setCart(c => ({ ...c, [p._id]: (c[p._id] || 0) + 1 })); showToast(`${p.name} added! 🛒`); };
    const remFromCart = (id) => setCart(c => { const n = { ...c }; n[id] > 1 ? n[id]-- : delete n[id]; return n; });

    const cartProds = PRODUCTS.filter(p => cart[p._id]);
    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    const subtotal = cartProds.reduce((a, p) => a + p.price * cart[p._id], 0);
    const deliveryFee = subtotal >= 199 ? 0 : 29;
    const taxes = Math.round(subtotal * 0.02);
    const total = subtotal + deliveryFee + taxes;
    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    const filtered = PRODUCTS.filter(p => {
        const mc = activeCat === "all" || p.category === activeCat;
        const ms = p.name.toLowerCase().includes(search.toLowerCase());
        return mc && ms;
    });
    const grouped = CATEGORIES.filter(c => c.id !== "all").map(c => ({ ...c, items: filtered.filter(p => p.category === c.id) })).filter(c => c.items.length > 0);

    const onOrderPlaced = (order) => {
        setOrders(prev => [order, ...prev]);
        if (user && order.savedAddrObj) {
            setUser(u => ({ ...u, address: order.savedAddrObj }));
        }
        delete order.savedAddrObj;
        setActiveOrder(order); setCart({}); setCartOpen(false); setCheckoutOpen(false); setScreen("tracking");
    };

    return (
        <div style={{ fontFamily: "'Nunito',sans-serif", background: "#F8F7FF", minHeight: "100vh" }}>
            <STYLES />
            {screen === "auth" && <CustAuth onLogin={(u) => { setUser(u); setScreen("home"); }} onBack={onExit} />}
            {screen === "home" && <>
                {/* Header */}
                <header style={{ position: "sticky", top: 0, zIndex: 50, background: "white", boxShadow: "0 2px 16px rgba(124,58,237,0.07)", padding: "0 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0 8px" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#7C3AED,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
                        <div><div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 16, color: "#1F1235" }}>quikmart</div><div style={{ fontSize: 11, color: "#7C3AED", fontWeight: 700 }}>📍 Koramangala, Bengaluru ▾</div></div>
                        <div style={{ flex: 1 }} />
                        <div style={{ background: "#F3F0FF", borderRadius: 20, padding: "5px 12px", fontSize: 13, fontWeight: 800, color: "#7C3AED" }}>⚡ 10 min</div>
                        <button className="press" onClick={() => setCartOpen(true)} style={{ position: "relative", background: "#7C3AED", border: "none", borderRadius: 12, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                            <span style={{ fontSize: 18 }}>🛒</span>
                            {totalItems > 0 && <div style={{ position: "absolute", top: -6, right: -6, background: "#EF4444", color: "white", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, border: "2px solid white" }}>{totalItems}</div>}
                        </button>
                    </div>
                    <div style={{ position: "relative", marginBottom: 12 }}>
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15, opacity: 0.4 }}>🔍</span>
                        <input className="c-input" style={{ paddingLeft: 38, background: "#F3F0FF", border: "2px solid transparent" }} placeholder="Search groceries, snacks..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </header>

                <main style={{ paddingBottom: 80, maxWidth: 480, margin: "0 auto" }}>
                    {/* Offer chips */}
                    <div style={{ padding: "12px 16px 0", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
                        {[["🚚", "Free delivery above ₹199", "#DCFCE7", "#166534"], ["💸", "10% cashback on UPI", "#FEF9C3", "#A16207"], ["🎁", "New user: ₹50 off", "#EDE9FE", "#5B21B6"]].map(([ic, tx, bg, cl], i) => (
                            <div key={i} style={{ background: bg, color: cl, borderRadius: 100, padding: "6px 14px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>{ic} {tx}</div>
                        ))}
                    </div>

                    {/* Banner */}
                    {!search && <div style={{ padding: "14px 16px 0" }}>
                        <div style={{ borderRadius: 20, overflow: "hidden", height: 150, background: BANNERS[activeBanner].bg, position: "relative" }}>
                            <div style={{ padding: "24px", zIndex: 1, position: "relative" }}>
                                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Limited Offer</div>
                                <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 4 }}>{BANNERS[activeBanner].title}</div>
                                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{BANNERS[activeBanner].sub}</div>
                            </div>
                            <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontSize: 72, opacity: 0.25 }}>{BANNERS[activeBanner].emoji}</div>
                            <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
                                {BANNERS.map((_, i) => <button key={i} onClick={() => setActiveBanner(i)} style={{ width: i === activeBanner ? 20 : 6, height: 6, borderRadius: 3, border: "none", background: i === activeBanner ? "white" : "rgba(255,255,255,0.4)", transition: "all 0.3s", cursor: "pointer" }} />)}
                            </div>
                        </div>
                    </div>}

                    {/* Flash timer */}
                    {!search && <div style={{ margin: "14px 16px 0", background: "linear-gradient(135deg,#FEF9C3,#FEF3C7)", borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, border: "1px solid #FDE68A" }}>
                        <span style={{ fontSize: 28 }}>⏱️</span>
                        <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 14, color: "#92400E" }}>Flash Deals Ending In</div><div style={{ fontSize: 12, color: "#B45309" }}>Up to 50% off</div></div>
                        <div style={{ background: "#D97706", color: "white", borderRadius: 10, padding: "6px 14px", fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 18 }}>{fmt(countdown)}</div>
                    </div>}

                    {/* Categories */}
                    <div style={{ padding: "16px 16px 0" }}>
                        <div className="hscroll">
                            {CATEGORIES.map(cat => (
                                <button key={cat.id} className="press" onClick={() => setActiveCat(cat.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 14px", borderRadius: 14, border: "none", cursor: "pointer", flexShrink: 0, background: activeCat === cat.id ? "#7C3AED" : "white", color: activeCat === cat.id ? "white" : "#4B5563", boxShadow: activeCat === cat.id ? "0 4px 16px rgba(124,58,237,0.3)" : "0 2px 8px rgba(0,0,0,0.06)", fontFamily: "'Nunito',sans-serif", transition: "all 0.2s" }}>
                                    <span style={{ fontSize: 22 }}>{cat.emoji}</span>
                                    <span style={{ fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products */}
                    <div style={{ padding: "16px 16px 0" }}>
                        {(search || activeCat !== "all") ? (
                            <>
                                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 17, color: "#1F1235", marginBottom: 14 }}>
                                    {search ? `"${search}"` : (CATEGORIES.find(c => c.id === activeCat)?.label)}
                                    <span style={{ fontSize: 13, fontWeight: 500, color: "#9CA3AF", marginLeft: 8 }}>({filtered.length})</span>
                                </div>
                                {filtered.length === 0 ? (<div style={{ textAlign: "center", padding: "60px 0", color: "#9CA3AF" }}><div style={{ fontSize: 48, marginBottom: 12 }}>🥲</div><div style={{ fontWeight: 700 }}>Nothing found</div></div>) : (
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                        {filtered.map(p => <ProdCard key={p._id} p={p} qty={cart[p._id] || 0} onAdd={() => addToCart(p)} onRem={() => remFromCart(p._id)} />)}
                                    </div>
                                )}
                            </>
                        ) : (
                            grouped.map(g => (
                                <div key={g.id} style={{ marginBottom: 24 }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{ fontSize: 20 }}>{g.emoji}</span>
                                            <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: "#1F1235" }}>{g.label}</span>
                                        </div>
                                        <button onClick={() => setActiveCat(g.id)} style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", background: "#EDE9FE", border: "none", borderRadius: 20, padding: "4px 12px", cursor: "pointer" }}>See all</button>
                                    </div>
                                    <div className="hscroll">
                                        {g.items.map(p => <div key={p._id} style={{ flexShrink: 0, width: 160 }}><ProdCard p={p} qty={cart[p._id] || 0} onAdd={() => addToCart(p)} onRem={() => remFromCart(p._id)} /></div>)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>

                {/* Bottom Nav */}
                <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "white", borderTop: "1px solid #F3F0FF", display: "flex", zIndex: 40, boxShadow: "0 -4px 20px rgba(124,58,237,0.08)" }}>
                    {[["🏠", "Home", () => { }], ["📦", "Orders", () => setScreen("orderslist")], ["👤", "Profile", () => setScreen("profile")]].map(([icon, label, action], i) => (
                        <button key={i} onClick={action} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "10px 0 8px", cursor: "pointer", border: "none", background: "transparent", color: i === 0 ? "#7C3AED" : "#9CA3AF", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 11 }}>
                            <span style={{ fontSize: 22 }}>{icon}</span>{label}
                        </button>
                    ))}
                </nav>

                {/* Cart */}
                {cartOpen && <CartDrawer cartProds={cartProds} cart={cart} subtotal={subtotal} deliveryFee={deliveryFee} taxes={taxes} total={total} onAdd={addToCart} onRem={remFromCart} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />}
                {checkoutOpen && <CheckoutModal user={user} cartProds={cartProds} cart={cart} subtotal={subtotal} deliveryFee={deliveryFee} taxes={taxes} total={total} onClose={() => setCheckoutOpen(false)} onOrderPlaced={onOrderPlaced} showToast={showToast} />}
            </>}

            {screen === "tracking" && activeOrder && <OrderTracking order={activeOrder} onBack={() => setScreen("home")} />}
            {screen === "orderslist" && <OrdersList myOrders={orders.filter(o => o.customer === user?.name)} onBack={() => setScreen("home")} onTrack={o => { setActiveOrder(o); setScreen("tracking"); }} />}
            {screen === "profile" && <CustProfile user={user} onBack={() => setScreen("home")} onLogout={() => { setUser(null); setScreen("auth"); }} onSwitchRole={onExit} onNavigate={setScreen} showToast={showToast} />}

            {toast && <div className="toast-in" style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#1F1235", color: "white", padding: "10px 20px", borderRadius: 30, fontSize: 13, fontWeight: 700, zIndex: 999, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>{toast}</div>}
        </div>
    );
}

// ── Customer Auth ─────────────────────────────────────────────────────────────
function CustAuth({ onLogin, onBack }) {
    const [mode, setMode] = useState("login");
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [err, setErr] = useState("");
    const submit = () => {
        if (!form.email || !form.password) { setErr("Please fill all fields"); return; }
        if (mode === "register" && !form.name) { setErr("Please enter your name"); return; }
        onLogin({ name: form.name || form.email.split("@")[0], email: form.email });
    };
    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#F3F0FF,#FFF7ED)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div className="modal-in" style={{ width: "100%", maxWidth: 400, background: "white", borderRadius: 28, padding: "36px 28px", boxShadow: "0 20px 60px rgba(124,58,237,0.15)" }}>
                <button onClick={onBack} style={{ background: "#F3F0FF", border: "none", borderRadius: 10, padding: "6px 14px", cursor: "pointer", marginBottom: 20, fontSize: 13, color: "#7C3AED", fontWeight: 700 }}>← Switch Role</button>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg,#7C3AED,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 12px" }}>⚡</div>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 26, color: "#1F1235" }}>quikmart</div>
                    <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>Groceries in 10 minutes</div>
                </div>
                <div style={{ display: "flex", background: "#F3F0FF", borderRadius: 14, padding: 4, marginBottom: 20 }}>
                    {["login", "register"].map(m => (
                        <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "10px", borderRadius: 11, border: "none", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, background: mode === m ? "white" : "transparent", color: mode === m ? "#7C3AED" : "#9CA3AF", boxShadow: mode === m ? "0 2px 8px rgba(124,58,237,0.15)" : "none", transition: "all 0.2s" }}>
                            {m === "login" ? "Sign In" : "Register"}
                        </button>
                    ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {mode === "register" && <input className="c-input" placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />}
                    <input className="c-input" type="email" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    <input className="c-input" type="password" placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                </div>
                {err && <div style={{ marginTop: 10, padding: "10px 14px", background: "#FEE2E2", borderRadius: 10, fontSize: 13, color: "#DC2626", fontWeight: 600 }}>⚠️ {err}</div>}
                <button className="press" onClick={submit} style={{ width: "100%", marginTop: 20, padding: 15, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "white", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15 }}>
                    {mode === "login" ? "Sign In →" : "Create Account →"}
                </button>
            </div>
        </div>
    );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProdCard({ p, qty, onAdd, onRem }) {
    const tc = TAG_COLORS[p.tag] || null;
    return (
        <div className="hover-up fade" style={{ background: "white", borderRadius: 18, padding: "14px 12px 12px", border: "1px solid #F3F0FF", position: "relative", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ position: "absolute", top: 10, left: 10, background: "#EF4444", color: "white", fontSize: 10, fontWeight: 800, padding: "3px 7px", borderRadius: 6 }}>{p.badge}</div>
            {tc && <div style={{ position: "absolute", top: 10, right: 10, background: tc.bg, color: tc.color, fontSize: 9, fontWeight: 800, padding: "3px 7px", borderRadius: 6, textTransform: "uppercase" }}>{p.tag}</div>}
            <div style={{ width: "100%", aspectRatio: "1", background: "#F8F7FF", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, marginTop: 8 }}>{p.emoji}</div>
            <div><div style={{ fontWeight: 700, fontSize: 14, color: "#1F1235", lineHeight: 1.3 }}>{p.name}</div><div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{p.weight}</div></div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 16, color: "#1F1235" }}>₹{p.price}</span>
                <span style={{ fontSize: 12, color: "#D1D5DB", textDecoration: "line-through" }}>₹{p.mrp}</span>
            </div>
            {qty === 0 ? (
                <button onClick={onAdd} style={{ width: "100%", padding: "8px", borderRadius: 10, border: "2px solid #7C3AED", background: "white", color: "#7C3AED", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.18s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#7C3AED"; e.currentTarget.style.color = "white" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#7C3AED" }}
                >ADD</button>
            ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#7C3AED", borderRadius: 10, padding: "4px 8px" }}>
                    <button style={{ background: "none", border: "none", color: "white", fontSize: 18, fontWeight: 700, cursor: "pointer", width: 28, height: 28 }} onClick={onRem}>−</button>
                    <span style={{ color: "white", fontWeight: 800, fontSize: 15 }}>{qty}</span>
                    <button style={{ background: "none", border: "none", color: "white", fontSize: 18, fontWeight: 700, cursor: "pointer", width: 28, height: 28 }} onClick={onAdd}>+</button>
                </div>
            )}
        </div>
    );
}

// ── Cart Drawer ───────────────────────────────────────────────────────────────
function CartDrawer({ cartProds, cart, subtotal, deliveryFee, taxes, total, onAdd, onRem, onClose, onCheckout }) {
    return (
        <>
            <div className="overlay-in" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, backdropFilter: "blur(4px)" }} />
            <div className="slide" style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: "min(420px,100vw)", background: "white", zIndex: 70, display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)" }}>
                <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #F3F0FF", display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={onClose} style={{ background: "#F3F0FF", border: "none", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>←</button>
                    <div><div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 18, color: "#1F1235" }}>My Cart</div><div style={{ fontSize: 12, color: "#9CA3AF" }}>Delivery in 10 min ⚡</div></div>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
                    {cartProds.length === 0 ? (
                        <div style={{ textAlign: "center", paddingTop: 80, color: "#9CA3AF" }}>
                            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
                            <div style={{ fontWeight: 700, fontSize: 16 }}>Your cart is empty</div>
                            <button onClick={onClose} style={{ marginTop: 20, background: "#7C3AED", color: "white", border: "none", borderRadius: 12, padding: "12px 28px", fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>Browse Products</button>
                        </div>
                    ) : (
                        <>
                            <div style={{ background: "#DCFCE7", borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                                <span>⚡</span><span style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>Delivery in 10 minutes!</span>
                            </div>
                            {cartProds.map(p => (
                                <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid #F9F8FF" }}>
                                    <div style={{ width: 54, height: 54, background: "#F3F0FF", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{p.emoji}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, fontSize: 14, color: "#1F1235" }}>{p.name}</div>
                                        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{p.weight}</div>
                                        <div style={{ fontWeight: 800, fontSize: 15, color: "#7C3AED", marginTop: 4 }}>₹{p.price}</div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", background: "#F3F0FF", borderRadius: 10, padding: "2px 4px" }}>
                                        <button style={{ background: "none", border: "none", color: "#7C3AED", fontSize: 18, fontWeight: 700, cursor: "pointer", width: 28, height: 28 }} onClick={() => onRem(p._id)}>−</button>
                                        <span style={{ width: 26, textAlign: "center", fontWeight: 800, fontSize: 15, color: "#1F1235" }}>{cart[p._id]}</span>
                                        <button style={{ background: "none", border: "none", color: "#7C3AED", fontSize: 18, fontWeight: 700, cursor: "pointer", width: 28, height: 28 }} onClick={() => onAdd(p)}>+</button>
                                    </div>
                                </div>
                            ))}
                            {subtotal < 199 && <div style={{ background: "#FEF9C3", borderRadius: 12, padding: "10px 14px", marginTop: 12, fontSize: 12, fontWeight: 600, color: "#A16207" }}>💡 Add ₹{199 - subtotal} more for FREE delivery!</div>}
                        </>
                    )}
                </div>
                {cartProds.length > 0 && (
                    <div style={{ padding: "16px 20px 20px", borderTop: "1px solid #F3F0FF" }}>
                        {[["Subtotal", `₹${subtotal}`], ["Delivery", deliveryFee === 0 ? <span style={{ color: "#16A34A", fontWeight: 700 }}>FREE</span> : `₹${deliveryFee}`], ["Taxes (2%)", `₹${taxes}`]].map(([l, v], i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#6B7280" }}><span>{l}</span><span style={{ fontWeight: 600, color: "#1F1235" }}>{v}</span></div>
                        ))}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", borderTop: "1px dashed #E5E7EB", marginTop: 4 }}>
                            <span style={{ fontWeight: 800, fontSize: 16, color: "#1F1235" }}>Total</span><span style={{ fontWeight: 800, fontSize: 18, color: "#7C3AED" }}>₹{total}</span>
                        </div>
                        <button className="press" onClick={onCheckout} style={{ width: "100%", marginTop: 14, padding: 16, borderRadius: 16, border: "none", background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "white", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}>
                            <span>Checkout ⚡</span><span>₹{total}</span>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

// ── Checkout Modal ────────────────────────────────────────────────────────────
function CheckoutModal({ user, cartProds, cart, subtotal, deliveryFee, taxes, total, onClose, onOrderPlaced, showToast }) {
    const [step, setStep] = useState("address");
    const [addr, setAddr] = useState(user?.address || { label: "Home", line1: "", city: "Bengaluru", pincode: "", phone: "" });
    const [payMethod, setPayMethod] = useState("UPI");
    const [utr, setUtr] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const placeOrder = async () => {
        if (step === "upi_verify") {
            if (utr.trim().length < 6) { setErr("Please enter a valid Transaction / UTR No."); return; }
        } else {
            if (!addr.line1 || !addr.pincode || !addr.phone) { setErr("Fill in your address and contact number"); return; }
            setErr("");

            if (payMethod === "UPI") {
                const tempId = "ORD" + String(Date.now()).slice(-5);
                window.location.href = `upi://pay?pa=7794968859@upi&pn=QuikMart&am=${total}&tr=${tempId}`;
                setStep("upi_verify");
                return;
            }
        }

        setErr(""); setLoading(true); setStep("processing");
        await new Promise(r => setTimeout(r, 2200));

        const orderId = "ORD" + String(Date.now()).slice(-5);

        const order = {
            id: orderId,
            customer: user?.name || "Guest",
            phone: addr.phone || "+91 90000 00000",
            address: `${addr.line1}, ${addr.city}`,
            savedAddrObj: addr,
            pincode: addr.pincode,
            items: cartProds.map(p => ({ name: p.name, qty: cart[p._id], price: p.price, emoji: p.emoji })),
            total, subtotal, delivery: deliveryFee, taxes,
            paymentMethod: payMethod, paymentStatus: payMethod === "COD" ? "pending" : "paid", status: "placed",
            paymentId: payMethod === "UPI" ? utr : null,
            time: new Date(),
            deliveryAgent: { name: "Rahul K.", phone: "+91 98765 43210", avatar: "🛵" },
            statusHistory: [{ status: "placed", message: "Order placed! 🎉", timestamp: new Date() }],
            estimatedDelivery: new Date(Date.now() + 10 * 60000),
        };
        onOrderPlaced(order);
        setLoading(false);
    };

    return (
        <>
            <div className="overlay-in" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 80, backdropFilter: "blur(6px)" }} />
            <div className="modal-in" style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                <div style={{ width: "100%", maxWidth: 480, background: "white", borderRadius: "28px 28px 0 0", maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #F3F0FF", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 18, color: "#1F1235" }}>
                            {step === "address" ? "📍 Delivery Address" : step === "payment" ? "💳 Payment" : step === "upi_verify" ? "⚡ UPI Verification" : "⏳ Processing..."}
                        </div>
                        {step !== "processing" && <button onClick={onClose} style={{ background: "#F3F0FF", border: "none", borderRadius: 10, width: 34, height: 34, cursor: "pointer", fontSize: 16 }}>✕</button>}
                    </div>
                    <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
                        {step === "processing" ? (
                            <div style={{ textAlign: "center", padding: "60px 20px" }}>
                                <div style={{ fontSize: 64, marginBottom: 20, animation: "spin 1s linear infinite" }}>⚡</div>
                                <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, color: "#1F1235", marginBottom: 8 }}>Processing Payment...</div>
                                <div style={{ color: "#9CA3AF", fontSize: 14 }}>Don't close this window</div>
                            </div>
                        ) : step === "upi_verify" ? (
                            <div className="fade" style={{ textAlign: "center", padding: "20px 10px" }}>
                                <div style={{ fontSize: 50, marginBottom: 12 }}>📱</div>
                                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 18, color: "#1F1235", marginBottom: 6 }}>Confirm UPI Payment</div>
                                <div style={{ color: "#6B7280", fontSize: 13, marginBottom: 24, lineHeight: 1.5 }}>
                                    Did you complete the payment? Please enter the <strong>12-digit UTR</strong> or <strong>Transaction ID</strong> from your UPI app below.
                                </div>
                                <input className="c-input" placeholder="e.g. 301234567890" value={utr} onChange={e => setUtr(e.target.value.replace(/\s/g, ""))} style={{ textAlign: "center", fontSize: 16, letterSpacing: 1, fontWeight: 700 }} />
                            </div>
                        ) : step === "address" ? (
                            <>
                                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                                    {["Home", "Work", "Other"].map(l => (
                                        <button key={l} onClick={() => setAddr(a => ({ ...a, label: l }))} style={{ padding: "8px 16px", borderRadius: 10, border: `2px solid ${addr.label === l ? "#7C3AED" : "#E5E7EB"}`, background: addr.label === l ? "#EDE9FE" : "white", color: addr.label === l ? "#7C3AED" : "#6B7280", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                                            {l === "Home" ? "🏠" : l === "Work" ? "🏢" : "📍"} {l}
                                        </button>
                                    ))}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <div><label style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", display: "block", marginBottom: 6 }}>ADDRESS LINE 1</label><input className="c-input" placeholder="Flat no., Building, Street" value={addr.line1} onChange={e => setAddr(a => ({ ...a, line1: e.target.value }))} /></div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                        <div><label style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", display: "block", marginBottom: 6 }}>CITY</label><input className="c-input" placeholder="City" value={addr.city} onChange={e => setAddr(a => ({ ...a, city: e.target.value }))} /></div>
                                        <div><label style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", display: "block", marginBottom: 6 }}>PINCODE</label><input className="c-input" placeholder="560001" maxLength={6} value={addr.pincode} onChange={e => setAddr(a => ({ ...a, pincode: e.target.value.replace(/\D/g, "") }))} /></div>
                                    </div>
                                    <div><label style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", display: "block", marginBottom: 6 }}>CONTACT NUMBER</label><input className="c-input" type="tel" placeholder="+91 90000 00000" value={addr.phone} onChange={e => setAddr(a => ({ ...a, phone: e.target.value }))} /></div>
                                </div>
                                <div style={{ marginTop: 16, padding: 14, background: "#F8F7FF", borderRadius: 14 }}>
                                    {cartProds.slice(0, 3).map(p => (
                                        <div key={p._id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6B7280", marginBottom: 6 }}><span>{p.emoji} {p.name} ×{cart[p._id]}</span><span>₹{p.price * cart[p._id]}</span></div>
                                    ))}
                                    {cartProds.length > 3 && <div style={{ fontSize: 12, color: "#9CA3AF" }}>+{cartProds.length - 3} more</div>}
                                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 15, color: "#7C3AED", marginTop: 10, paddingTop: 10, borderTop: "1px dashed #E5E7EB" }}><span>Total</span><span>₹{total}</span></div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                                    {["UPI", "COD"].map(m => (
                                        <button key={m} onClick={() => setPayMethod(m)} style={{ flex: 1, padding: "10px", borderRadius: 12, border: `2px solid ${payMethod === m ? "#7C3AED" : "#E5E7EB"}`, background: payMethod === m ? "#EDE9FE" : "white", color: payMethod === m ? "#7C3AED" : "#6B7280", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>
                                            {m === "UPI" ? "⚡ UPI" : "💵 Cash on Delivery"}
                                        </button>
                                    ))}
                                </div>
                                {payMethod === "UPI" && (
                                    <div style={{ padding: 24, textAlign: "center", background: "#F3F0FF", borderRadius: 18, border: "2px solid #E5E7EB" }}>
                                        <div style={{ fontSize: 40, marginBottom: 8 }}>📱</div>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: "#1F1235", marginBottom: 4 }}>Pay using UPI App</div>
                                        <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>You will be redirected to your UPI app (GPay, PhonePe, Paytm, etc) to pay to <br /><strong style={{ color: "#7C3AED" }}>7794968859</strong>.</div>
                                    </div>
                                )}
                                {payMethod === "COD" && (
                                    <div style={{ padding: 24, textAlign: "center", background: "#F3F0FF", borderRadius: 18, border: "2px solid #E5E7EB" }}>
                                        <div style={{ fontSize: 40, marginBottom: 8 }}>💵</div>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: "#1F1235", marginBottom: 4 }}>Cash on Delivery</div>
                                        <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>Pay by cash or UPI when the delivery partner arrives at your doorstep.</div>
                                    </div>
                                )}
                            </>
                        )}
                        {err && <div style={{ marginTop: 10, padding: "10px 14px", background: "#FEE2E2", borderRadius: 10, fontSize: 13, color: "#DC2626", fontWeight: 600 }}>⚠️ {err}</div>}
                    </div>
                    {step !== "processing" && (
                        <div style={{ padding: "16px 20px 24px", borderTop: "1px solid #F3F0FF" }}>
                            {step === "address" ? (
                                <button className="press" onClick={() => { if (!addr.line1 || !addr.pincode || !addr.phone) { setErr("Fill address and phone"); return; } setErr(""); setStep("payment"); }} style={{ width: "100%", padding: 15, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "white", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Continue to Payment →</button>
                            ) : step === "upi_verify" ? (
                                <button className="press" onClick={placeOrder} style={{ width: "100%", padding: 16, borderRadius: 16, border: "none", background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "white", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}>
                                    ✅ Confirm Order
                                </button>
                            ) : (
                                <button className="press" onClick={placeOrder} style={{ width: "100%", padding: 16, borderRadius: 16, border: "none", background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "white", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}>
                                    <span>🔒 Pay & Place Order</span><span>₹{total}</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// ── Order Tracking ────────────────────────────────────────────────────────────
function OrderTracking({ order, onBack }) {
    const STEPS = ["placed", "confirmed", "packed", "dispatched", "delivered"];
    const ci = STEPS.indexOf(order.status);
    const sc = STATUS_CFG[order.status] || {};
    const mins = order.estimatedDelivery ? Math.max(0, Math.round((new Date(order.estimatedDelivery) - Date.now()) / 60000)) : 10;
    return (
        <div style={{ background: "#F8F7FF", minHeight: "100vh" }}>
            <div style={{ background: `linear-gradient(135deg,#7C3AED,#A855F7)`, padding: "20px 20px 50px" }}>
                <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 16, color: "white", marginBottom: 16 }}>←</button>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Order #{order.id}</div>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 24, color: "white", marginBottom: 4 }}>
                    {order.status === "delivered" ? "🎉 Delivered!" : order.status === "cancelled" ? "❌ Cancelled" : `⚡ ~${mins} min away`}
                </div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{order.status === "delivered" ? "Thank you!" : "Your order is on its way"}</div>
            </div>
            <div style={{ margin: "-20px 16px 0", position: "relative", zIndex: 10 }}>
                <div style={{ background: "white", borderRadius: 20, padding: 20, boxShadow: "0 4px 20px rgba(124,58,237,0.1)", marginBottom: 16 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#1F1235", marginBottom: 16 }}>Order Progress</div>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                        {STEPS.map((s, i) => (
                            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? "1" : "0" }}>
                                <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, background: i <= ci ? "#7C3AED" : "#F3F0FF", flexShrink: 0, boxShadow: i === ci ? "0 0 0 4px rgba(124,58,237,0.2)" : "none" }}>
                                    {i < ci ? "✓" : STATUS_CFG[s].icon}
                                </div>
                                {i < STEPS.length - 1 && <div style={{ flex: 1, height: 3, background: i < ci ? "#7C3AED" : "#E5E7EB", margin: "0 3px", borderRadius: 2 }} />}
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {STEPS.map((s, i) => <div key={s} style={{ flex: i < STEPS.length - 1 ? 1 : 0, textAlign: "center", fontSize: 9, color: i <= ci ? "#7C3AED" : "#9CA3AF", fontWeight: i === ci ? 800 : 500 }}>{STATUS_CFG[s].label}</div>)}
                    </div>
                </div>
                {/* Agent */}
                {order.deliveryAgent && ["dispatched", "delivered"].includes(order.status) && (
                    <div style={{ background: "white", borderRadius: 20, padding: 20, boxShadow: "0 4px 20px rgba(124,58,237,0.1)", marginBottom: 16 }}>
                        <div style={{ fontWeight: 800, fontSize: 15, color: "#1F1235", marginBottom: 12 }}>Delivery Agent</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{order.deliveryAgent.avatar}</div>
                            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 16, color: "#1F1235" }}>{order.deliveryAgent.name}</div><div style={{ fontSize: 13, color: "#9CA3AF" }}>Your delivery partner</div></div>
                            <a href={`tel:${order.deliveryAgent.phone}`} style={{ width: 44, height: 44, borderRadius: "50%", background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, textDecoration: "none" }}>📞</a>
                        </div>
                    </div>
                )}
                {/* Items */}
                <div style={{ background: "white", borderRadius: 20, padding: 20, boxShadow: "0 4px 20px rgba(124,58,237,0.1)", marginBottom: 16 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#1F1235", marginBottom: 12 }}>Your Items</div>
                    {order.items?.map((it, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #F9F8FF" }}>
                            <div style={{ width: 42, height: 42, background: "#F3F0FF", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{it.emoji}</div>
                            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14, color: "#1F1235" }}>{it.name}</div><div style={{ fontSize: 12, color: "#9CA3AF" }}>×{it.qty}</div></div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "#7C3AED" }}>₹{it.price * it.qty}</div>
                        </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 15, marginTop: 12, paddingTop: 12, borderTop: "1px dashed #E5E7EB" }}><span style={{ color: "#1F1235" }}>Total Paid</span><span style={{ color: "#7C3AED" }}>₹{order.total}</span></div>
                </div>
                <button onClick={onBack} style={{ width: "100%", padding: 16, borderRadius: 16, border: "none", background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "white", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", marginBottom: 20 }}>Continue Shopping 🛒</button>
            </div>
        </div>
    );
}

function OrdersList({ myOrders, onBack, onTrack }) {
    return (
        <div style={{ background: "#F8F7FF", minHeight: "100vh" }}>
            <div style={{ background: "white", padding: "20px 20px 16px", boxShadow: "0 2px 16px rgba(124,58,237,0.07)", display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={onBack} style={{ background: "#F3F0FF", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 16 }}>←</button>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, color: "#1F1235" }}>My Orders</div>
            </div>
            <div style={{ padding: 16 }}>
                {(myOrders || []).length === 0 ? (
                    <div style={{ textAlign: "center", paddingTop: 80, color: "#9CA3AF" }}><div style={{ fontSize: 64, marginBottom: 16 }}>📦</div><div style={{ fontWeight: 700, fontSize: 18 }}>No orders yet</div></div>
                ) : (myOrders || []).map(o => (
                    <div key={o.id} className="hover-up" onClick={() => onTrack(o)} style={{ background: "white", borderRadius: 20, padding: 16, marginBottom: 12, boxShadow: "0 4px 16px rgba(124,58,237,0.07)", cursor: "pointer" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                            <div><div style={{ fontWeight: 800, fontSize: 14, color: "#1F1235" }}>#{o.id}</div><div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{timeSince(o.time)}</div></div>
                            <div style={{ padding: "5px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700, background: STATUS_CFG[o.status]?.bg, color: STATUS_CFG[o.status]?.color }}>{STATUS_CFG[o.status]?.label}</div>
                        </div>
                        <div style={{ display: "flex", gap: 6, fontSize: 18, marginBottom: 8 }}>{o.items?.slice(0, 5).map((it, i) => <span key={i}>{it.emoji}</span>)}</div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 13, color: "#6B7280" }}>{o.items?.length} items</span><span style={{ fontWeight: 800, fontSize: 15, color: "#7C3AED" }}>₹{o.total}</span></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CustProfile({ user, onBack, onLogout, onSwitchRole, onNavigate, showToast }) {
    const handleAction = (lb) => {
        if (lb === "My Orders") onNavigate("orderslist");
        else showToast(`${lb} coming soon! 🚧`);
    };

    return (
        <div style={{ background: "#F8F7FF", minHeight: "100vh" }}>
            <div style={{ background: "linear-gradient(135deg,#7C3AED,#A855F7)", padding: "20px 20px 50px" }}>
                <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 16, color: "white", marginBottom: 16 }}>←</button>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>👤</div>
                    <div><div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, color: "white" }}>{user?.name}</div><div style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>{user?.email}</div></div>
                </div>
            </div>
            <div style={{ margin: "-20px 16px 0", position: "relative" }}>
                {[["📦", "My Orders"], ["📍", "Saved Addresses"], ["💳", "Payment Methods"], ["🎁", "Offers & Coupons"], ["❓", "Help & Support"]].map(([ic, lb], i) => (
                    <div key={i} onClick={() => handleAction(lb)} className="hover-up" style={{ background: "white", borderRadius: 14, padding: 16, marginBottom: 8, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", boxShadow: "0 2px 8px rgba(124,58,237,0.06)" }}>
                        <div style={{ width: 42, height: 42, background: "#F3F0FF", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{ic}</div>
                        <span style={{ fontWeight: 700, fontSize: 15, color: "#1F1235", flex: 1 }}>{lb}</span>
                        <span style={{ color: "#D1D5DB" }}>›</span>
                    </div>
                ))}
                <button className="press" onClick={onSwitchRole} style={{ width: "100%", marginBottom: 8, padding: 14, borderRadius: 14, border: "1px solid #EDE9FE", background: "white", color: "#7C3AED", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>🔄 Switch Role</button>
                <button className="press" onClick={onLogout} style={{ width: "100%", marginBottom: 24, padding: 14, borderRadius: 14, border: "2px solid #FEE2E2", background: "white", color: "#EF4444", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>🚪 Sign Out</button>
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════════
//  ADMIN APP
// ════════════════════════════════════════════════════════
function AdminApp({ onExit, orders, setOrders }) {
    const [authed, setAuthed] = useState(false);
    const [tab, setTab] = useState("overview");
    const [products, setProducts] = useState(PRODUCTS.slice(0, 10).map((p, i) => ({ ...p, id: p._id, stock: Math.floor(Math.random() * 80) + 5, active: true })));
    const [selOrder, setSelOrder] = useState(null);
    const [orderFilter, setOrderFilter] = useState("all");
    const [showAddProd, setShowAddProd] = useState(false);
    const [editProd, setEditProd] = useState(null);
    const [toast, setToast] = useState("");

    const showToast = m => { setToast(m); setTimeout(() => setToast(""), 2200); };
    const updStatus = (id, s) => { setOrders(o => o.map(ord => ord.id === id ? { ...ord, status: s } : ord)); if (selOrder?.id === id) setSelOrder(o => ({ ...o, status: s })); showToast(`Order ${id} → ${s}`); };
    const saveProd = p => { if (p.id) { setProducts(pr => pr.map(r => r.id === p.id ? p : r)); } else { setProducts(pr => [...pr, { ...p, id: "p" + Date.now(), active: true }]); } setShowAddProd(false); setEditProd(null); showToast(p.id ? "Updated ✅" : "Added ✅"); };
    const delProd = id => { setProducts(p => p.filter(r => r.id !== id)); showToast("Removed"); };
    const togProd = id => setProducts(p => p.map(r => r.id === id ? { ...r, active: !r.active } : r));

    const revenue = orders.filter(o => o.paymentStatus === "paid").reduce((a, o) => a + o.total, 0);
    const pending = orders.filter(o => ["placed", "confirmed", "packed", "dispatched"].includes(o.status)).length;
    const filtered = orders.filter(o => orderFilter === "all" || o.status === orderFilter);

    if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} onExit={onExit} />;

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#0F1117", fontFamily: "'DM Sans',sans-serif", color: "#E2E8F0" }}>
            <ADMIN_STYLES />
            {/* Sidebar */}
            <aside style={{ width: 200, background: "#0D1117", borderRight: "1px solid #1E2535", display: "flex", flexDirection: "column", padding: "16px 10px", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px 16px", borderBottom: "1px solid #1E2535", marginBottom: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
                    <div><div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 14, color: "#F1F5F9" }}>QuikMart</div><div style={{ fontSize: 9, color: "#475569", fontWeight: 600 }}>ADMIN PANEL</div></div>
                </div>
                {[["overview", "📊", "Overview"], ["orders", "📦", "All Orders"], ["products", "🛒", "Products"]].map(([id, ic, lb]) => (
                    <button key={id} onClick={() => setTab(id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 500, border: "none", background: tab === id ? "rgba(99,102,241,0.15)" : "transparent", color: tab === id ? "#818CF8" : "#64748B", borderLeft: tab === id ? "3px solid #6366F1" : "3px solid transparent", marginBottom: 2, width: "100%", textAlign: "left" }}>{ic} {lb}{id === "orders" && pending > 0 && <span style={{ marginLeft: "auto", background: "#EF4444", color: "white", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800 }}>{pending}</span>}</button>
                ))}
                <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid #1E2535" }}>
                    <button onClick={onExit} style={{ width: "100%", padding: 8, borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#F87171", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12 }}>← Switch Role</button>
                </div>
            </aside>

            <main style={{ flex: 1, overflowY: "auto" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #1E2535", display: "flex", alignItems: "center", gap: 10, background: "#0F1117", position: "sticky", top: 0, zIndex: 20 }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, color: "#F1F5F9" }}>
                        {tab === "overview" ? "📊 Overview" : tab === "orders" ? "📦 All Orders" : "🛒 Products"}
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
                        <span style={{ fontSize: 12, color: "#10B981", fontWeight: 600 }}>Live</span>
                    </div>
                </div>

                <div style={{ padding: 20 }}>
                    {/* Overview */}
                    {tab === "overview" && (
                        <div className="fade">
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 24 }}>
                                {[
                                    { label: "Revenue", value: `₹${revenue.toLocaleString()}`, icon: "💰", color: "#10B981" },
                                    { label: "Total Orders", value: orders.length, icon: "📦", color: "#6366F1" },
                                    { label: "Pending", value: pending, icon: "🛵", color: "#F59E0B" },
                                    { label: "Products", value: products.filter(p => p.active).length, icon: "🛒", color: "#3B82F6" },
                                ].map((s, i) => (
                                    <div key={i} style={{ background: "#161B27", border: "1px solid #1E2535", borderRadius: 14, padding: 16 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</span>
                                            <div style={{ width: 34, height: 34, borderRadius: 10, background: s.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{s.icon}</div>
                                        </div>
                                        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ background: "#161B27", border: "1px solid #1E2535", borderRadius: 14, overflow: "hidden" }}>
                                <div style={{ padding: "14px 18px", borderBottom: "1px solid #1E2535", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: "#F1F5F9" }}>Recent Orders</div>
                                <div style={{ overflowX: "auto" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead><tr style={{ borderBottom: "1px solid #1E2535" }}>{["Order", "Customer", "Items", "Total", "Payment", "Status", "Action"].map(h => <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
                                        <tbody>{orders.slice(0, 5).map(o => <AdminOrderRow key={o.id} order={o} onView={() => setSelOrder(o)} onUpdate={updStatus} />)}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Orders */}
                    {tab === "orders" && (
                        <div className="fade">
                            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                                {["all", "placed", "confirmed", "packed", "dispatched", "delivered", "cancelled"].map(f => (
                                    <button key={f} onClick={() => setOrderFilter(f)} style={{ padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", background: orderFilter === f ? "#6366F1" : "#161B27", color: orderFilter === f ? "white" : "#64748B", border: `1px solid ${orderFilter === f ? "#6366F1" : "#1E2535"}` }}>
                                        {f === "all" ? "All" : STATUS_CFG[f]?.label}
                                    </button>
                                ))}
                            </div>
                            <div style={{ background: "#161B27", border: "1px solid #1E2535", borderRadius: 14, overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead><tr style={{ borderBottom: "1px solid #1E2535" }}>{["Order", "Customer", "Phone", "Items", "Total", "Payment", "Status", "Action"].map(h => <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
                                    <tbody>{filtered.length === 0 ? <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#475569" }}>No orders</td></tr> : filtered.map(o => <AdminOrderRow key={o.id} order={o} onView={() => setSelOrder(o)} onUpdate={updStatus} full />)}</tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Products */}
                    {tab === "products" && (
                        <div className="fade">
                            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                                <button onClick={() => { setEditProd(null); setShowAddProd(true); }} style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.3)" }}>+ Add Product</button>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
                                {products.map(p => (
                                    <div key={p.id} style={{ background: "#161B27", border: "1px solid #1E2535", borderRadius: 14, padding: 14, opacity: p.active ? 1 : 0.5 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                            <div style={{ width: 46, height: 46, borderRadius: 12, background: "#1A1F2E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{p.emoji}</div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 700, fontSize: 13, color: "#E2E8F0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                                                <div style={{ fontSize: 11, color: "#475569", textTransform: "capitalize" }}>{p.category} · {p.weight}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 16, color: "#F1F5F9" }}>₹{p.price}</span>
                                            <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", borderRadius: 100, fontSize: 10, fontWeight: 700, background: p.stock === 0 ? "#FEF2F2" : p.stock <= 10 ? "#FEF3C7" : "#ECFDF5", color: p.stock === 0 ? "#EF4444" : p.stock <= 10 ? "#D97706" : "#10B981" }}>
                                                {p.stock === 0 ? "Out of Stock" : p.stock <= 10 ? `${p.stock} left` : `${p.stock} in stock`}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            <button onClick={() => togProd(p.id)} style={{ flex: 1, padding: "6px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none", background: p.active ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", color: p.active ? "#F87171" : "#34D399" }}>{p.active ? "Disable" : "Enable"}</button>
                                            <button onClick={() => { setEditProd(p); setShowAddProd(true); }} style={{ flex: 1, padding: "6px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none", background: "rgba(99,102,241,0.1)", color: "#818CF8" }}>Edit</button>
                                            <button onClick={() => delProd(p.id)} style={{ padding: "6px 10px", borderRadius: 8, fontSize: 11, cursor: "pointer", border: "none", background: "rgba(239,68,68,0.08)", color: "#F87171" }}>🗑</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {selOrder && <AdminOrderModal order={selOrder} onClose={() => setSelOrder(null)} onUpdate={(id, s) => { updStatus(id, s); setSelOrder(o => ({ ...o, status: s })); }} />}
            {showAddProd && <ProdFormModal product={editProd} onSave={saveProd} onClose={() => { setShowAddProd(false); setEditProd(null); }} />}
            {toast && <div className="toast-in" style={{ position: "fixed", bottom: 24, right: 24, background: "#1E2535", border: "1px solid #2D3748", color: "#E2E8F0", padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600, zIndex: 999 }}>✅ {toast}</div>}
        </div>
    );
}

function AdminLogin({ onLogin, onExit }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [err, setErr] = useState("");
    const submit = () => { if (form.email === "admin@quikmart.in" && form.password === "admin123") { onLogin(); } else { setErr("Use admin@quikmart.in / admin123"); } };
    return (
        <div style={{ minHeight: "100vh", background: "#0D1117", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>
            <ADMIN_STYLES />
            <div style={{ width: "min(400px,95vw)", background: "#0F1117", border: "1px solid #1E2535", borderRadius: 22, padding: 32, boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
                <button onClick={onExit} style={{ background: "#1A1F2E", border: "1px solid #2D3748", borderRadius: 8, padding: "6px 14px", cursor: "pointer", color: "#64748B", fontSize: 12, fontWeight: 600, marginBottom: 20 }}>← Switch Role</button>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 12px" }}>⚡</div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 22, color: "#F1F5F9" }}>Admin Dashboard</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div><label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</label><input className="a-input" type="email" placeholder="admin@quikmart.in" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onKeyDown={e => e.key === "Enter" && submit()} /></div>
                    <div><label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Password</label><input className="a-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && submit()} /></div>
                </div>
                {err && <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(239,68,68,0.1)", borderRadius: 10, fontSize: 13, color: "#F87171", fontWeight: 600 }}>⚠️ {err}</div>}
                <button onClick={submit} style={{ width: "100%", marginTop: 18, padding: 14, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 24px rgba(99,102,241,0.3)" }}>Sign In →</button>
                <div style={{ marginTop: 14, padding: "10px 12px", background: "#161B27", borderRadius: 10, fontSize: 12, color: "#475569" }}>🔑 <strong style={{ color: "#818CF8" }}>admin@quikmart.in</strong> / <strong style={{ color: "#818CF8" }}>admin123</strong></div>
            </div>
        </div>
    );
}

function AdminOrderRow({ order, onView, onUpdate, full }) {
    const sc = STATUS_CFG[order.status] || {};
    const pc = PAY_CFG[order.paymentStatus] || {};
    const next = { placed: "confirmed", confirmed: "packed", packed: "dispatched", dispatched: "delivered" }[order.status];
    return (
        <tr style={{ borderBottom: "1px solid #1A1F2E", cursor: "pointer" }} onClick={onView}>
            <td style={{ padding: "10px 14px" }}><span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 12, color: "#818CF8" }}>#{order.id}</span></td>
            <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, color: "#CBD5E1", whiteSpace: "nowrap" }}>{order.customer}</td>
            {full && <td style={{ padding: "10px 14px", fontSize: 12, color: "#64748B" }}>{order.phone}</td>}
            <td style={{ padding: "10px 14px" }}><div style={{ display: "flex", gap: 2, fontSize: 15 }}>{order.items.slice(0, 3).map((it, i) => <span key={i}>{it.emoji}</span>)}{order.items.length > 3 && <span style={{ fontSize: 10, color: "#475569", paddingTop: 4 }}>+{order.items.length - 3}</span>}</div></td>
            <td style={{ padding: "10px 14px", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, color: "#F1F5F9" }}>₹{order.total}</td>
            <td style={{ padding: "10px 14px" }}><span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", borderRadius: 100, fontSize: 10, fontWeight: 700, background: pc.bg, color: pc.color }}>{pc.label}</span></td>
            <td style={{ padding: "10px 14px" }}><span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", borderRadius: 100, fontSize: 10, fontWeight: 700, background: sc.bg, color: sc.color }}>{sc.icon} {sc.label}</span></td>
            <td style={{ padding: "10px 14px" }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", gap: 5 }}>
                    {next && order.status !== "cancelled" && <button onClick={e => { e.stopPropagation(); onUpdate(order.id, next); }} style={{ padding: "5px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", background: STATUS_CFG[next].color, color: "white", whiteSpace: "nowrap" }}>→ {STATUS_CFG[next].label}</button>}
                </div>
            </td>
        </tr>
    );
}

function AdminOrderModal({ order, onClose, onUpdate }) {
    const STEPS = ["placed", "confirmed", "packed", "dispatched", "delivered"];
    const ci = STEPS.indexOf(order.status);
    const sc = STATUS_CFG[order.status] || {};
    const pc = PAY_CFG[order.paymentStatus] || {};
    return (
        <>
            <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, backdropFilter: "blur(6px)" }} />
            <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 101, width: "min(580px,95vw)", maxHeight: "90vh", overflowY: "auto", background: "#0F1117", border: "1px solid #1E2535", borderRadius: 18, boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
                <div style={{ padding: "18px 22px", borderBottom: "1px solid #1E2535", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1 }}><div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 17, color: "#F1F5F9" }}>Order #{order.id}</div><div style={{ fontSize: 11, color: "#475569" }}>{timeSince(order.time)}</div></div>
                    <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.color }}>{sc.icon} {sc.label}</span>
                    <button onClick={onClose} style={{ background: "#1A1F2E", border: "1px solid #2D3748", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: "#64748B", fontSize: 14 }}>✕</button>
                </div>
                <div style={{ padding: 22 }}>
                    {order.status !== "cancelled" && (
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: 11, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Progress</div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                {STEPS.map((s, i) => (
                                    <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? "1" : "0" }}>
                                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: i <= ci ? STATUS_CFG[s].color : "#1A1F2E", border: `2px solid ${i <= ci ? STATUS_CFG[s].color : "#2D3748"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, boxShadow: i === ci ? `0 0 8px ${STATUS_CFG[s].color}60` : "none" }}>{i < ci ? "✓" : STATUS_CFG[s].icon}</div>
                                        {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < ci ? STATUS_CFG[s].color : "#1E2535", margin: "0 3px" }} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                        <div style={{ background: "#161B27", borderRadius: 12, padding: 14 }}>
                            <div style={{ fontSize: 10, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Customer</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", marginBottom: 2 }}>{order.customer}</div>
                            <div style={{ fontSize: 12, color: "#64748B", marginBottom: 8 }}>{order.phone}</div>
                            <a href={`tel:${order.phone}`} style={{ display: "inline-block", padding: "5px 12px", background: "rgba(99,102,241,0.15)", color: "#818CF8", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>📞 Call</a>
                        </div>
                        <div style={{ background: "#161B27", borderRadius: 12, padding: 14 }}>
                            <div style={{ fontSize: 10, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Address</div>
                            <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{order.address}</div>
                            <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>📍 {order.pincode}</div>
                        </div>
                    </div>
                    <div style={{ background: "#161B27", borderRadius: 12, padding: 14, marginBottom: 16 }}>
                        <div style={{ fontSize: 10, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Payment</div>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                            {[["Method", order.paymentMethod], ["Status", <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 100, fontSize: 10, fontWeight: 700, background: pc.bg, color: pc.color }}>{pc.label}</span>], ["Subtotal", `₹${order.subtotal}`], ["Delivery", order.delivery === 0 ? <span style={{ color: "#10B981" }}>FREE</span> : `₹${order.delivery}`], ["Taxes", `₹${order.taxes}`], ["ID", order.paymentId || "N/A"], ["Total", <span style={{ color: "#818CF8", fontWeight: 800, fontSize: 15 }}>₹{order.total}</span>]].filter(x => x[0] !== "ID" || order.paymentId).map(([l, v], i) => (
                                <div key={i} style={{ flex: "1 0 28%", minWidth: 80 }}><div style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>{l}</div><div style={{ fontSize: 13, fontWeight: 600, color: "#CBD5E1", wordBreak: "break-all" }}>{v}</div></div>
                            ))}
                        </div>
                    </div>
                    <div style={{ background: "#161B27", borderRadius: 12, padding: 14, marginBottom: 16 }}>
                        <div style={{ fontSize: 10, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Items</div>
                        {order.items.map((it, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < order.items.length - 1 ? "1px solid #1A1F2E" : "none" }}>
                                <span style={{ fontSize: 20 }}>{it.emoji}</span>
                                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: "#CBD5E1" }}>{it.name}</div><div style={{ fontSize: 11, color: "#475569" }}>×{it.qty}</div></div>
                                <div style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 13 }}>₹{it.price * it.qty}</div>
                            </div>
                        ))}
                    </div>
                    {order.status !== "delivered" && order.status !== "cancelled" && (
                        <div>
                            <div style={{ fontSize: 11, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Update Status</div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {["confirmed", "packed", "dispatched", "delivered"].filter(s => STEPS.indexOf(s) > STEPS.indexOf(order.status)).map(s => (
                                    <button key={s} onClick={() => onUpdate(order.id, s)} style={{ padding: "9px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", background: STATUS_CFG[s].color, color: "white" }}>{STATUS_CFG[s].icon} Mark {STATUS_CFG[s].label}</button>
                                ))}
                                {["placed", "confirmed"].includes(order.status) && <button onClick={() => onUpdate(order.id, "cancelled")} style={{ padding: "9px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700, border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer", background: "rgba(239,68,68,0.1)", color: "#F87171" }}>❌ Cancel</button>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function ProdFormModal({ product, onSave, onClose }) {
    const EMOJIS = ["🍌", "🍅", "🥦", "🥕", "🍏", "🥬", "🥛", "🥚", "🧈", "🫙", "🥔", "🍫", "🥜", "🍿", "🍊", "🍵", "💧", "☕", "🍞", "🥐", "🍗", "🦐", "🧴", "🫧", "🧼", "🧹", "🫛", "🍦"];
    const [form, setForm] = useState(product || { name: "", category: "fruits", price: "", mrp: "", weight: "", emoji: "🛒", stock: "", tag: "" });
    const [picker, setPicker] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const disc = form.price && form.mrp ? Math.round((1 - form.price / form.mrp) * 100) : 0;
    const submit = () => { if (!form.name || !form.price || !form.mrp || !form.stock) return; onSave({ ...form, price: Number(form.price), mrp: Number(form.mrp), stock: Number(form.stock), badge: disc > 0 ? `${disc}% OFF` : "" }); };
    return (
        <>
            <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, backdropFilter: "blur(6px)" }} />
            <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 101, width: "min(460px,95vw)", maxHeight: "90vh", overflowY: "auto", background: "#0F1117", border: "1px solid #1E2535", borderRadius: 18 }}>
                <div style={{ padding: "18px 22px", borderBottom: "1px solid #1E2535", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 17, color: "#F1F5F9" }}>{product ? "✏️ Edit" : "➕ Add"} Product</div>
                    <button onClick={onClose} style={{ background: "#1A1F2E", border: "1px solid #2D3748", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: "#64748B", fontSize: 14 }}>✕</button>
                </div>
                <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Emoji</label>
                        <button onClick={() => setPicker(s => !s)} style={{ width: 56, height: 56, borderRadius: 14, background: "#1A1F2E", border: "2px solid #2D3748", fontSize: 30, cursor: "pointer" }}>{form.emoji}</button>
                        {picker && <div style={{ marginTop: 8, padding: 10, background: "#161B27", borderRadius: 10, border: "1px solid #1E2535", display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {EMOJIS.map(e => <button key={e} onClick={() => { set("emoji", e); setPicker(false); }} style={{ width: 34, height: 34, borderRadius: 8, background: form.emoji === e ? "rgba(99,102,241,0.2)" : "transparent", border: `1px solid ${form.emoji === e ? "#6366F1" : "transparent"}`, fontSize: 18, cursor: "pointer" }}>{e}</button>)}
                        </div>}
                    </div>
                    <div><label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Product Name *</label><input className="a-input" placeholder="e.g. Fresh Bananas" value={form.name} onChange={e => set("name", e.target.value)} /></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div><label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Category *</label><select className="a-select" value={form.category} onChange={e => set("category", e.target.value)}>{["fruits", "dairy", "snacks", "beverages", "bakery", "meat", "personal", "household", "frozen"].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}</select></div>
                        <div><label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Weight / Unit</label><input className="a-input" placeholder="e.g. 500 g" value={form.weight} onChange={e => set("weight", e.target.value)} /></div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div><label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Selling Price ₹ *</label><input className="a-input" type="number" placeholder="29" value={form.price} onChange={e => set("price", e.target.value)} /></div>
                        <div><label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>MRP ₹ *</label><input className="a-input" type="number" placeholder="40" value={form.mrp} onChange={e => set("mrp", e.target.value)} /></div>
                    </div>
                    {disc > 0 && <div style={{ padding: "8px 12px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, fontSize: 13, color: "#34D399", fontWeight: 600 }}>✅ Auto badge: {disc}% OFF</div>}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div><label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Stock Qty *</label><input className="a-input" type="number" placeholder="100" value={form.stock} onChange={e => set("stock", e.target.value)} /></div>
                        <div><label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Tag (optional)</label><select className="a-select" value={form.tag || ""} onChange={e => set("tag", e.target.value)}><option value="">None</option>{["bestseller", "organic", "fresh", "healthy", "premium", "daily", "wellness"].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "#1A1F2E", color: "#64748B", border: "1px solid #2D3748", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14 }}>Cancel</button>
                        <button onClick={submit} disabled={!form.name || !form.price || !form.mrp || !form.stock} style={{ flex: 2, padding: "12px", borderRadius: 10, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", border: "none", cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, opacity: (!form.name || !form.price || !form.mrp || !form.stock) ? 0.5 : 1 }}>
                            {product ? "💾 Save Changes" : "➕ Add Product"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

// ════════════════════════════════════════════════════════
//  DELIVERY APP
// ════════════════════════════════════════════════════════
function DeliveryApp({ onExit, orders, setOrders }) {
    const [tab, setTab] = useState("active");
    const [selOrder, setSelOrder] = useState(null);
    const [toast, setToast] = useState("");
    const showToast = m => { setToast(m); setTimeout(() => setToast(""), 2200); };

    const updStatus = (id, s) => { setOrders(o => o.map(ord => ord.id === id ? { ...ord, status: s } : ord)); if (selOrder?.id === id) setSelOrder(o => ({ ...o, status: s })); showToast(`Marked as ${s}!`); };

    const active = orders.filter(o => ["placed", "confirmed", "packed", "dispatched"].includes(o.status));
    const delivered = orders.filter(o => o.status === "delivered");

    return (
        <div style={{ background: "#0F1117", minHeight: "100vh", fontFamily: "'Nunito',sans-serif", color: "#E2E8F0" }}>
            <ADMIN_STYLES />
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg,#D97706,#F59E0B)", padding: "20px 16px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🛵</div>
                    <div style={{ flex: 1 }}><div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 20, color: "white" }}>Delivery Board</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Tap an order to act on it</div></div>
                    <button onClick={onExit} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "white", fontWeight: 700, fontSize: 12 }}>← Switch</button>
                </div>
                {/* Stats */}
                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                    {[["📦", "Active", active.length, "rgba(255,255,255,0.2)"], ["🎉", "Delivered", delivered.length, "rgba(255,255,255,0.2)"], ["💰", "Earnings", `₹${delivered.reduce((a, o) => a + o.total, 0)}`, "rgba(255,255,255,0.2)"]].map(([ic, lb, val, bg], i) => (
                        <div key={i} style={{ flex: 1, background: bg, borderRadius: 12, padding: "10px 12px", textAlign: "center" }}>
                            <div style={{ fontSize: 20 }}>{ic}</div>
                            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 16, color: "white" }}>{val}</div>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{lb}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", padding: "12px 16px 0", gap: 8, background: "#161B27", borderBottom: "1px solid #1E2535" }}>
                {[["active", "🔴 Active", "font-weight:700"], ["delivered", "✅ Delivered", ""]].map(([id, lb]) => (
                    <button key={id} onClick={() => setTab(id)} style={{ padding: "10px 20px", borderRadius: "10px 10px 0 0", border: "none", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, background: tab === id ? "#0F1117" : "transparent", color: tab === id ? "#F59E0B" : "#64748B", borderBottom: tab === id ? "2px solid #F59E0B" : "2px solid transparent" }}>
                        {lb} {id === "active" && `(${active.length})`}
                    </button>
                ))}
            </div>

            {/* Orders */}
            <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
                {tab === "active" && (
                    active.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 0", color: "#475569" }}><div style={{ fontSize: 48, marginBottom: 12 }}>✅</div><div style={{ fontWeight: 700, fontSize: 16 }}>All caught up!</div><div style={{ fontSize: 13, marginTop: 4 }}>No active orders right now</div></div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {active.map(o => {
                                const sc = STATUS_CFG[o.status];
                                const next = { placed: "confirmed", confirmed: "packed", packed: "dispatched", dispatched: "delivered" }[o.status];
                                return (
                                    <div key={o.id} style={{ background: "#161B27", borderRadius: 16, overflow: "hidden", border: "1px solid #1E2535" }}>
                                        {/* Top strip */}
                                        <div style={{ background: sc.color + "22", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1E2535" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span style={{ fontSize: 18 }}>{sc.icon}</span>
                                                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, color: sc.color }}>{sc.label}</span>
                                            </div>
                                            <div style={{ fontSize: 12, color: "#64748B" }}>{timeSince(o.time)}</div>
                                        </div>
                                        <div style={{ padding: 16 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                                <div><div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: "#F1F5F9" }}>#{o.id}</div><div style={{ fontSize: 13, color: "#CBD5E1", marginTop: 2 }}>{o.customer}</div></div>
                                                <div style={{ textAlign: "right" }}><div style={{ fontWeight: 800, fontSize: 18, color: "#F59E0B" }}>₹{o.total}</div><div style={{ fontSize: 11, color: "#64748B" }}>{o.paymentMethod}</div></div>
                                            </div>
                                            <div style={{ display: "flex", gap: 4, fontSize: 22, marginBottom: 10 }}>{o.items.slice(0, 5).map((it, i) => <span key={i}>{it.emoji}</span>)}</div>
                                            <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 14, padding: "10px 12px", background: "#1A1F2E", borderRadius: 10 }}>
                                                <span>📍</span>
                                                <div>
                                                    <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.5 }}>{o.address}</div>
                                                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>PIN: {o.pincode}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <a href={`tel:${o.phone}`} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)", color: "#818CF8", textAlign: "center", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>📞 Call</a>
                                                {next && <button onClick={() => updStatus(o.id, next)} style={{ flex: 2, padding: "10px", borderRadius: 10, background: sc.color, color: "white", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
                                                    Mark {STATUS_CFG[next].label} →
                                                </button>}
                                                {o.status === "dispatched" && <button onClick={() => updStatus(o.id, "delivered")} style={{ flex: 2, padding: "10px", borderRadius: 10, background: "#10B981", color: "white", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 13 }}>✅ Delivered!</button>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                )}

                {tab === "delivered" && (
                    delivered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 0", color: "#475569" }}><div style={{ fontSize: 48, marginBottom: 12 }}>📦</div><div style={{ fontWeight: 700, fontSize: 16 }}>No deliveries yet</div></div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {delivered.map(o => (
                                <div key={o.id} style={{ background: "#161B27", borderRadius: 14, padding: 16, border: "1px solid #1E2535", display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 46, height: 46, background: "rgba(16,185,129,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🎉</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: "#F1F5F9" }}>#{o.id}</div>
                                        <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{o.customer} · {timeSince(o.time)}</div>
                                    </div>
                                    <div style={{ fontWeight: 800, fontSize: 16, color: "#10B981" }}>₹{o.total}</div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
            {toast && <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#1A1F2E", border: "1px solid #2D3748", color: "#E2E8F0", padding: "10px 20px", borderRadius: 30, fontSize: 13, fontWeight: 700, zIndex: 99, whiteSpace: "nowrap" }}>✅ {toast}</div>}
        </div>
    );
}

// ── Global Styles ─────────────────────────────────────────────────────────────
function STYLES() {
    return <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Sora:wght@600;700;800&display=swap');
    * { box-sizing:border-box; margin:0; padding:0; }
    ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:4px}
    .hover-up{transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s;cursor:pointer} .hover-up:hover{transform:translateY(-4px);box-shadow:0 12px 28px rgba(124,58,237,0.13)}
    .press{transition:transform 0.12s ease;cursor:pointer} .press:active{transform:scale(0.94)}
    .fade{animation:fi 0.3s ease} @keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .slide{animation:sl 0.35s cubic-bezier(0.34,1.56,0.64,1)} @keyframes sl{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
    .modal-in{animation:mi 0.3s cubic-bezier(0.34,1.56,0.64,1)} @keyframes mi{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
    .overlay-in{animation:oi 0.25s ease} @keyframes oi{from{opacity:0}to{opacity:1}}
    .toast-in{animation:ti 0.3s ease} @keyframes ti{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
    .hscroll{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none} .hscroll::-webkit-scrollbar{display:none}
    .c-input{width:100%;padding:11px 14px;border-radius:12px;border:2px solid #E5E7EB;font-family:'Nunito',sans-serif;font-size:14px;color:#1F1235;background:white;outline:none;transition:border 0.2s} .c-input:focus{border-color:#7C3AED}
  `}</style>;
}
function ADMIN_STYLES() {
    return <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&display=swap');
    * { box-sizing:border-box; margin:0; padding:0; }
    .fade{animation:fi 0.3s ease} @keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    .toast-in{animation:ti 0.3s ease} @keyframes ti{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .a-input{background:#1A1F2E;border:1.5px solid #2D3748;border-radius:10px;color:#E2E8F0;font-family:'DM Sans',sans-serif;font-size:14px;padding:10px 14px;width:100%;outline:none;transition:border 0.2s} .a-input:focus{border-color:#6366F1}
    .a-select{background:#1A1F2E;border:1.5px solid #2D3748;border-radius:10px;color:#E2E8F0;font-family:'DM Sans',sans-serif;font-size:14px;padding:10px 14px;width:100%;outline:none;cursor:pointer}
  `}</style>;
}