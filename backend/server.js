const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require("./db"); 

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(express.json());

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

// CORS
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.options("*", cors());

// DATABASE
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// BASE ROUTE
app.get("/", (req, res) => {
  console.log("✅ Base route / called");
  res.send("API is running...");
});

// ✅ IMPORT ROUTES
const authRoutes = require("./routes/authRoutes");
const googleAuthRoutes = require("./routes/googleAuthRoutes");
const orderRoutes = require("./routes/orderRoutes");
const otpRoutes = require("./routes/otpRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const productRoutes = require("./routes/productRoutes");
const eventRoutes = require("./routes/eventRoutes");

// ✅ REGISTER ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/auth/google", googleAuthRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api", eventRoutes);

console.log("✅ Routes registered:");
console.log("   - /api/auth");
console.log("   - /api/auth/google");
console.log("   - /api/orders");
console.log("   - /api/otp");
console.log("   - /api/payment");

// ✅ TEST PAYMENT ROUTE
app.get("/api/payment/test", (req, res) => {
  console.log("✅ Test route called");
  res.json({ 
    message: "Payment routes are working!",
    razorpayKeyExists: !!process.env.RAZORPAY_KEY_ID 
  });
});

// ✅ TEST SHIPMENT EMAIL (SEPARATE ENDPOINT - BEFORE SHIPMENT)
app.post("/api/test-shipment-email", async (req, res) => {
  console.log("🧪 TEST EMAIL REQUEST:", req.body);
  
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"E-Groots" <${process.env.EMAIL_USER}>`,
      to: "bharanidharan7502@gmail.com",
      subject: "🧪 TEST Shipment Email - WORKING ✅",
      text: "Your shipment email system is working perfectly!"
    });

    res.json({ success: true, message: "✅ Test email sent to bharanidharan7502@gmail.com!" });
  } catch (err) {
    console.error("🧪 TEST EMAIL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ ORDER CONFIRMATION EMAIL
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
      .map(
        (item) =>
          `${item.name} - Qty: ${item.quantity} - ₹${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    await transporter.sendMail({
      from: `"E-Groots" <${process.env.EMAIL_USER}>`,
      to: customerInfo.email,
      subject: "Order Confirmation - E-Groots",
      text: `
Hello ${customerInfo.name},

Thank you for shopping with us!

Order Summary:
---------------------------------
${itemsList}

Total: ₹${total.toFixed(2)}
Payment Method: ${paymentMethod}

Regards,
E-Groots Team
      `,
    });

    res.json({ message: "Order confirmation sent successfully" });
  } catch (err) {
    console.error("Email Sending Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/events/send-confirmation", async (req, res) => {
  try {
    const { name, email, eventName } = req.body;

    if (!name || !email || !eventName) {
      return res.status(400).json({ error: "Missing email data" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"E-Groots" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for registering for ${eventName}`,
      text: `Hi ${name},

Thank you for completing your registration for ${eventName}.
We look forward to seeing you at the event!

Regards,
E-Groots Team`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Event confirmation email error:", err);
    res.status(500).json({ error: "Failed to send confirmation email" });
  }
});


// ✅ SHIPMENT CONFIRMATION EMAIL (FIXED - NO NESTING)
app.post("/api/send-shipment-email", async (req, res) => {
  try {
    const { customerInfo, items, total, orderId, trackingId } = req.body;

    console.log("📧 Sending shipment email to:", customerInfo?.email);
    console.log("📦 Order ID:", orderId);
    console.log("📧 EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Missing");

    if (!customerInfo?.email || !items || !total) {
      console.log("❌ Missing email data");
      return res.status(400).json({ message: "Missing order details" });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("❌ Email credentials missing in .env");
      return res.status(500).json({ error: "Email configuration missing" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      },
    });

    const itemsList = items
      .map(
        (item) =>
          `${item.name} x${item.quantity}`
      )
      .join("<br>");

    await transporter.sendMail({
  from: `"E-Groots" <${process.env.EMAIL_USER}>`,
  to: customerInfo.email,
  subject: `Order #${orderId.slice(-6).toUpperCase()} Shipped - E-Groots`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Shipped Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa; line-height: 1.6; color: #374151;">
      
      <!-- HEADER -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff;">
        <tr>
          <td style="padding: 40px 30px 30px; max-width: 600px; margin: 0 auto;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="text-align: center;">
                  <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: #1f2937; letter-spacing: -0.02em;">
                    Order Shipped
                  </h1>
                  <p style="margin: 0; font-size: 16px; color: #6b7280; font-weight: 500;">
                    Your package is on its way to you
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- MAIN CONTENT -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8f9fa;">
        <tr>
          <td style="padding: 0 30px 40px; max-width: 600px; margin: 0 auto;">
            
            <!-- GREETING -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden; border: 1px solid #e5e7eb;">
              <tr>
                <td style="padding: 32px;">
                  <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #1f2937;">
                    Hello <strong>${customerInfo.name}</strong>,
                  </p>
                  <p style="margin: 0; font-size: 16px; color: #4b5563; line-height: 1.7;">
                    Your order has been shipped successfully and is now on its way to your delivery address.
                  </p>
                </td>
              </tr>
            </table>

            <!-- ORDER SUMMARY -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 24px;">
              <tr>
                <td style="background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
                  <h3 style="margin: 0 0 24px 0; font-size: 18px; font-weight: 600; color: #1f2937;">
                    Order Details
                  </h3>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="padding: 12px 0; font-size: 15px; color: #374151; border-bottom: 1px solid #f3f4f6;">
                        <strong style="color: #1f2937;">Order ID:</strong>
                        <span style="float: right; font-family: 'Courier New', monospace; font-weight: 600; color: #1f2937;">#${orderId.slice(-6).toUpperCase()}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 0 12px 0; font-size: 24px; font-weight: 700; color: #1f2937; text-align: right; border-top: 2px solid #e5e7eb;">
                        ₹${total.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- ITEMS LIST -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 24px;">
              <tr>
                <td style="background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
                  <h4 style="margin: 0 0 24px 0; font-size: 17px; font-weight: 600; color: #1f2937;">
                    Items Shipped
                  </h4>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    ${itemsList.split('<br>').map(item => `
                      <tr>
                        <td style="padding: 14px 0; font-size: 16px; color: #374151; border-bottom: 1px solid #f3f4f6; line-height: 1.5;">
                          ${item}
                        </td>
                      </tr>
                    `).join('')}
                  </table>
                </td>
              </tr>
            </table>

            <!-- DELIVERY ADDRESS -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 24px;">
              <tr>
                <td style="background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
                  <h4 style="margin: 0 0 16px 0; font-size: 17px; font-weight: 600; color: #1f2937;">
                    Delivery Address
                  </h4>
                  <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6;">
                    ${customerInfo.address || 'Your registered address'}
                  </p>
                </td>
              </tr>
            </table>

            <!-- CTA BUTTON -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 32px;">
              <tr>
                <td style="text-align: center;">
                  <a href="http://localhost:8080" style="display: inline-block; padding: 16px 36px; background-color: #1f2937; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                    View My Orders
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>

      <!-- FOOTER -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9;">
        <tr>
          <td style="padding: 40px 30px 30px; max-width: 600px; margin: 0 auto; text-align: center;">
            <p style="margin: 0 0 16px 0; font-size: 15px; color: #6b7280; line-height: 1.5;">
              Thank you for shopping with <strong style="color: #1f2937;">E-Groots</strong>
            </p>
            <p style="margin: 0 0 24px 0; font-size: 14px; color: #9ca3af;">
              We'll notify you once your order arrives at your door.
            </p>
            <p style="margin: 0; font-size: 13px; color: #9ca3af;">
              © 2025 E-Groots. All rights reserved. | 
              <a href="http://localhost:8080" style="color: #6b7280; text-decoration: underline;">Visit Store</a>
            </p>
          </td>
        </tr>
      </table>

    </body>
    </html>
  `,
});


    console.log(`✅✅ Shipment email sent successfully to ${customerInfo.email}`);
    res.json({ message: "Shipment confirmation sent successfully" });
    
  } catch (err) {
    console.error("❌ Shipment Email Error:", err.message);
    console.error("❌ Full Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 404 HANDLER
app.use((req, res) => {
  console.log("❌ 404 - Route not found:", req.method, req.path);
  res.status(404).json({ 
    message: "Route not found",
    path: req.path,
    method: req.method
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  console.log(`💳 Payment Test: http://localhost:${PORT}/api/payment/test`);
  console.log(`🧪 Test Email: http://localhost:${PORT}/api/test-shipment-email`);
  console.log(`📧 Shipment Email: http://localhost:${PORT}/api/send-shipment-email ✅`);
});
