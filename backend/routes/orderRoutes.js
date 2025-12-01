const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Save Order WITHOUT Razorpay
router.post('/create', async (req, res) => {
  try {
    console.log("📩 Incoming Order Body:", req.body);

    const { customer, items, totalAmount } = req.body;

    const newOrder = new Order({
      customer,
      items,
      totalAmount,
      paymentMethod: "None"
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order saved successfully!",
      orderId: newOrder._id,
    });

  } catch (err) {
    console.error("🔥 Order Save Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;
