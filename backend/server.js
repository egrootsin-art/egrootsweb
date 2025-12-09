const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE - MUST BE FIRST
app.use(express.json());

// CORS
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

// SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true },
  })
);

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// DATABASE
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// BASE ROUTE
app.get("/", (req, res) => res.send("API is running..."));

// ✅ RAZORPAY ROUTES (INLINE - NO EXTERNAL FILE)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Get Razorpay Key
app.get("/api/payment/get-key", (req, res) => {
  console.log("✅ GET /api/payment/get-key called");
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// Create Order
app.post("/api/payment/create-order", async (req, res) => {
  console.log("✅ POST /api/payment/create-order called");
  try {
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    res.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("❌ Order error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Verify Payment
app.post("/api/payment/verify", (req, res) => {
  console.log("✅ POST /api/payment/verify called");
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OTHER ROUTES
const authRoutes = require("./routes/authRoutes");
const googleAuthRoutes = require("./routes/googleAuthRoutes");
const orderRoutes = require("./routes/orderRoutes");
const otpRoutes = require("./routes/otpRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/auth/google", googleAuthRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/otp", otpRoutes);

// EMAIL
app.post("/api/send-order-email", async (req, res) => {
  try {
    const { customerInfo, items, total, paymentMethod } = req.body;
    if (!customerInfo?.email || !items || !total) {
      return res.status(400).json({ message: "Missing order details" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const itemsList = items
      .map((item) => `${item.name} - Qty: ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`)
      .join("\n");

    await transporter.sendMail({
      from: `"E-Groots" <${process.env.EMAIL_USER}>`,
      to: customerInfo.email,
      subject: "Order Confirmation",
      text: `Hello ${customerInfo.name},\n\nThank you for shopping!\n\n${itemsList}\n\nTotal: ₹${total.toFixed(2)}\nPayment: ${paymentMethod}`,
    });

    res.json({ message: "Email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404
app.use((req, res) => {
  console.log("❌ 404:", req.method, req.path);
  res.status(404).json({ message: "Route not found" });
});

// START
app.listen(PORT, () => {
  console.log(`\n🚀 Server: http://localhost:${PORT}`);
  console.log(`✅ Payment routes loaded (inline)`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/payment/get-key\n`);
});
