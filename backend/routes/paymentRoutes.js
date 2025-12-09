const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ GET RAZORPAY KEY
router.get("/get-key", (req, res) => {
  console.log("✅ GET /api/payment/get-key called");
  console.log("🔑 Sending key:", process.env.RAZORPAY_KEY_ID);
  
  res.status(200).json({
    key: process.env.RAZORPAY_KEY_ID,
  });
});

// ✅ CREATE RAZORPAY ORDER
router.post("/create-order", async (req, res) => {
  console.log("✅ POST /api/payment/create-order called");
  console.log("📦 Request body:", req.body);
  
  try {
    const { amount } = req.body;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    console.log("✅ Order created:", order);

    res.status(200).json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("❌ Razorpay order creation error:", err);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: err.message,
    });
  }
});

// ✅ VERIFY RAZORPAY PAYMENT
router.post("/verify", (req, res) => {
  console.log("✅ POST /api/payment/verify called");
  console.log("🔐 Verifying signature...");
  
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("✅ Payment verified successfully");
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      console.log("❌ Invalid signature");
      res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (err) {
    console.error("❌ Payment verification error:", err);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: err.message,
    });
  }
});

module.exports = router;
