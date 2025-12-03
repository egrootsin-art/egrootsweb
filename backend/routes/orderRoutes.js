const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// ===============================
// 📌 CREATE NEW ORDER
// ===============================
router.post('/create', async (req, res) => {
  try {
    console.log("📥 Incoming Order Body:", req.body);   // <-- Added

    const { customer, items, totalAmount, paymentMethod } = req.body;

    if (!customer || !items || !totalAmount) {          // <-- Added
      console.log("❌ Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Missing required order fields",
      });
    }

    const newOrder = new Order({
      customer,
      items,
      totalAmount,
      paymentMethod: paymentMethod || "None",
      status: "Pending",
    });

    const savedOrder = await newOrder.save();            // <-- Added reference

    console.log("✅ Order Saved:", savedOrder._id);      // <-- Added log

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: savedOrder._id,
    });

  } catch (err) {
    console.error("❌ Order Create Error:", err);        // <-- Added log
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// 📌 GET ALL ORDERS (Admin Only)
// ===============================
router.get('/', async (req, res) => {
  try {
    console.log("📥 Fetching all orders...");            // <-- Added
    const orders = await Order.find().sort({ createdAt: -1 });

    console.log(`📦 Found ${orders.length} orders`);     // <-- Added

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("❌ Fetch Orders Error:", err);        // <-- Added
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// 🔄 UPDATE ORDER STATUS
// ===============================
router.put('/update-status/:id', async (req, res) => {
  try {
    console.log("🔄 Updating status for order:", req.params.id);  // <-- Added

    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      console.log("❌ Order not found");                // <-- Added
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    console.log("✅ Status Updated:", updatedOrder._id); // <-- Added

    res.json({ success: true, message: "Status updated", order: updatedOrder });

  } catch (err) {
    console.error("❌ Status Update Error:", err);       // <-- Added
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
