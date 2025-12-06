const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

// ROUTES
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const googleAuthRoutes = require("./routes/googleAuthRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------
// MIDDLEWARE
// ----------------------
app.use(express.json());

// SESSION (REQUIRED FOR GOOGLE LOGIN)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true only if using HTTPS
      httpOnly: true,
    },
  })
);

// PASSPORT INITIALIZE + SESSION
app.use(passport.initialize());
app.use(passport.session());

// CORS
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.options("*", cors());

// ----------------------
// DATABASE
// ----------------------
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ----------------------
// BASE ROUTE
// ----------------------
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ----------------------
// ROUTES
// ----------------------

// EMAIL + PASSWORD AUTH
app.use("/api/auth", authRoutes);

// GOOGLE AUTH  (IMPORTANT)
app.use("/api/auth/google", googleAuthRoutes);

// PAYMENTS
app.use("/api", paymentRoutes);

// ORDERS
app.use("/api/orders", orderRoutes);

// ----------------------
// EMAIL SENDER (ORDER CONFIRMATION)
// ----------------------
app.post("/api/send-order-email", async (req, res) => {
  try {
    const { customerInfo, items, total, paymentMethod } = req.body;

    if (!customerInfo?.email || !items || !total || !paymentMethod) {
      return res.status(400).json({ message: "Missing order details" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsList = items
      .map(
        (item) =>
          `${item.name} - Qty: ${item.quantity} - ₹${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    const mailOptions = {
      from: `"Your Shop" <${process.env.EMAIL_USER}>`,
      to: customerInfo.email,
      subject: "Order Confirmation",
      text: `
Hello ${customerInfo.name},

Thank you for shopping with us!

Order Summary:
---------------------------------
${itemsList}

Total: ₹${total.toFixed(2)}
Payment Method: ${paymentMethod}

Regards,
Egroots Innovate
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Order confirmation sent successfully" });
  } catch (err) {
    console.error("Email Sending Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// 404 HANDLER
// ----------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ----------------------
// START SERVER
// ----------------------
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
