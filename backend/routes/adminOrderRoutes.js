const express = require("express");
const Order = require("../models/Order");
const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({ orders });
  } catch (err) {
    console.log("Admin Order Fetch Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
