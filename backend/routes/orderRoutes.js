const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authenticate = require('../middleware/auth');

// ===============================
// 📌 CREATE NEW ORDER
// ===============================
router.post('/create', async (req, res) => {
  try {
    const { customer, items, totalAmount, paymentMethod } = req.body;

    // Validate and ensure prices are numbers
    const validatedItems = items.map(item => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
      if (price <= 0) {
        console.warn(`⚠️ Invalid price for item ${item.name}: ${item.price}, defaulting to 0`);
      }
      return {
        ...item,
        price: price,
        quantity: typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 1,
      };
    });

    console.log("📦 Order items with prices:", validatedItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })));

    const newOrder = new Order({
      customer,
      items: validatedItems,
      totalAmount: typeof totalAmount === 'number' ? totalAmount : parseFloat(totalAmount) || 0,
      paymentMethod: paymentMethod || "None",
      status: "Pending",
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });

  } catch (err) {
    console.error("❌ Order creation error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// 📌 GET ALL ORDERS (Admin Only)
// ===============================
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ===============================
// 📌 GET USER ORDERS (MyOrders page)
// ===============================
router.get("/user/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const orders = await Order.find({
      "customer.email": email,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ===============================
// 🔄 UPDATE ORDER STATUS
// ===============================
router.put('/update-status/:id', authenticate, async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Status updated", order: updatedOrder });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
