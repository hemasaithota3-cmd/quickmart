require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const Stripe = require("stripe");

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ─── MIDDLEWARE ─────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// ─── MONGODB CONNECTION ──────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/quikmart")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// ─── SCHEMAS ─────────────────────────────────────────────────────────────────

// User
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, default: "" },
  addresses: [{
    label: String, // Home / Work / Other
    line1: String,
    city: String,
    pincode: String,
    isDefault: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Product
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  weight: String,
  emoji: String,
  badge: String,
  tag: String,
  stock: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true }
});

// Order
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    emoji: String,
    price: Number,
    qty: Number
  }],
  address: {
    label: String,
    line1: String,
    city: String,
    pincode: String
  },
  subtotal: Number,
  deliveryFee: Number,
  taxes: Number,
  total: Number,
  paymentIntentId: String,
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  status: {
    type: String,
    enum: ["placed", "confirmed", "packed", "dispatched", "delivered", "cancelled"],
    default: "placed"
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    message: String
  }],
  estimatedDelivery: Date,
  deliveryAgent: {
    name: String,
    phone: String,
    avatar: String
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);
const Product = mongoose.model("Product", ProductSchema);
const Order = mongoose.model("Order", OrderSchema);

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "quikmart_secret_key");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ─── AUTH ROUTES ─────────────────────────────────────────────────────────────

// Register
app.post("/api/auth/register", [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be 6+ characters"),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed, phone });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "quikmart_secret_key", { expiresIn: "7d" });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/api/auth/login", [
  body("email").isEmail(),
  body("password").notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "quikmart_secret_key", { expiresIn: "7d" });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get profile
app.get("/api/auth/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

// ─── PRODUCT ROUTES ───────────────────────────────────────────────────────────

app.get("/api/products", async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { isActive: true };
    if (category && category !== "all") filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };
    const products = await Product.find(filter);
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ─── PAYMENT ROUTES ───────────────────────────────────────────────────────────

// Create payment intent
app.post("/api/payment/create-intent", authenticate, async (req, res) => {
  try {
    const { amount, currency = "inr" } = req.body;
    if (!amount || amount < 1) return res.status(400).json({ error: "Invalid amount" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      metadata: { userId: req.user._id.toString() },
      automatic_payment_methods: { enabled: true }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ORDER ROUTES ─────────────────────────────────────────────────────────────

// Create order
app.post("/api/orders", authenticate, async (req, res) => {
  try {
    const { items, address, paymentIntentId, subtotal, deliveryFee, taxes, total } = req.body;

    // Verify payment with Stripe
    if (paymentIntentId) {
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (intent.status !== "succeeded") {
        return res.status(400).json({ error: "Payment not completed" });
      }
    }

    const agents = [
      { name: "Rahul K.", phone: "+91 98765 43210", avatar: "🛵" },
      { name: "Priya M.", phone: "+91 87654 32109", avatar: "🚴" },
      { name: "Amit S.", phone: "+91 76543 21098", avatar: "🛵" },
    ];
    const agent = agents[Math.floor(Math.random() * agents.length)];

    const order = await Order.create({
      user: req.user._id,
      items,
      address,
      subtotal,
      deliveryFee,
      taxes,
      total,
      paymentIntentId,
      paymentStatus: paymentIntentId ? "paid" : "pending",
      status: "placed",
      statusHistory: [{ status: "placed", message: "Order placed successfully! 🎉" }],
      estimatedDelivery: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      deliveryAgent: agent
    });

    // Simulate order progression (in production use webhooks/queues)
    simulateOrderProgress(order._id);

    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders for user
app.get("/api/orders", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get single order
app.get("/api/orders/:id", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Cancel order
app.patch("/api/orders/:id/cancel", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (!["placed", "confirmed"].includes(order.status)) {
      return res.status(400).json({ error: "Order cannot be cancelled at this stage" });
    }
    order.status = "cancelled";
    order.statusHistory.push({ status: "cancelled", message: "Order cancelled by user" });
    await order.save();
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ─── ORDER SIMULATION ─────────────────────────────────────────────────────────
async function simulateOrderProgress(orderId) {
  const steps = [
    { status: "confirmed", delay: 15000, message: "Order confirmed! Store is preparing your items 🏪" },
    { status: "packed", delay: 45000, message: "Your order is packed and ready 📦" },
    { status: "dispatched", delay: 90000, message: "Delivery agent picked up your order 🛵" },
    { status: "delivered", delay: 180000, message: "Order delivered! Enjoy your groceries 🎉" },
  ];

  for (const step of steps) {
    await new Promise(r => setTimeout(r, step.delay));
    try {
      const order = await Order.findById(orderId);
      if (!order || order.status === "cancelled") break;
      order.status = step.status;
      order.statusHistory.push({ status: step.status, message: step.message });
      await order.save();
      console.log(`📦 Order ${orderId} → ${step.status}`);
    } catch (err) {
      console.error("Simulation error:", err);
    }
  }
}

// ─── SEED PRODUCTS ────────────────────────────────────────────────────────────
app.get("/api/seed", async (req, res) => {
  const products = [
    { name: "Fresh Bananas", weight: "6 pcs", price: 29, mrp: 40, emoji: "🍌", category: "fruits", badge: "25% OFF", tag: "bestseller", stock: 50 },
    { name: "Red Tomatoes", weight: "500 g", price: 18, mrp: 25, emoji: "🍅", category: "fruits", badge: "28% OFF", stock: 30 },
    { name: "Baby Spinach", weight: "200 g", price: 35, mrp: 45, emoji: "🥬", category: "fruits", badge: "22% OFF", tag: "organic", stock: 20 },
    { name: "Carrots Pack", weight: "500 g", price: 22, mrp: 30, emoji: "🥕", category: "fruits", badge: "27% OFF", stock: 40 },
    { name: "Green Apples", weight: "4 pcs", price: 89, mrp: 120, emoji: "🍏", category: "fruits", badge: "26% OFF", tag: "fresh", stock: 25 },
    { name: "Full Cream Milk", weight: "1 L", price: 68, mrp: 72, emoji: "🥛", category: "dairy", badge: "6% OFF", tag: "daily", stock: 80 },
    { name: "Farm Eggs", weight: "12 pcs", price: 89, mrp: 99, emoji: "🥚", category: "dairy", badge: "10% OFF", tag: "fresh", stock: 60 },
    { name: "Salted Butter", weight: "100 g", price: 55, mrp: 60, emoji: "🧈", category: "dairy", badge: "8% OFF", stock: 30 },
    { name: "Lay's Classic", weight: "90 g", price: 35, mrp: 40, emoji: "🥔", category: "snacks", badge: "12% OFF", stock: 100 },
    { name: "Dark Chocolate", weight: "100 g", price: 149, mrp: 180, emoji: "🍫", category: "snacks", badge: "17% OFF", tag: "premium", stock: 40 },
    { name: "Almonds", weight: "200 g", price: 199, mrp: 249, emoji: "🥜", category: "snacks", badge: "20% OFF", tag: "healthy", stock: 30 },
    { name: "Orange Juice", weight: "1 L", price: 99, mrp: 130, emoji: "🍊", category: "beverages", badge: "24% OFF", stock: 35 },
    { name: "Green Tea", weight: "25 bags", price: 125, mrp: 150, emoji: "🍵", category: "beverages", badge: "17% OFF", tag: "wellness", stock: 50 },
    { name: "Multigrain Bread", weight: "400 g", price: 55, mrp: 65, emoji: "🍞", category: "bakery", badge: "15% OFF", tag: "fresh baked", stock: 20 },
    { name: "Chicken Breast", weight: "500 g", price: 189, mrp: 220, emoji: "🍗", category: "meat", badge: "14% OFF", tag: "fresh cut", stock: 25 },
    { name: "Shampoo", weight: "200 ml", price: 179, mrp: 220, emoji: "🧴", category: "personal", badge: "19% OFF", stock: 40 },
    { name: "Dish Soap", weight: "500 ml", price: 89, mrp: 110, emoji: "🧼", category: "household", badge: "19% OFF", stock: 60 },
    { name: "Ice Cream", weight: "500 ml", price: 149, mrp: 180, emoji: "🍦", category: "frozen", badge: "17% OFF", tag: "bestseller", stock: 30 },
  ];
  await Product.deleteMany({});
  await Product.insertMany(products);
  res.json({ message: "✅ Products seeded!", count: products.length });
});

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date() }));

// ─── START ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 QuikMart API running on port ${PORT}`));