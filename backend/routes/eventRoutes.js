// backend/routes/eventRoutes.js
const express = require("express");
const Participant = require("../models/Participant");
const authenticate = require("../middleware/auth");

const router = express.Router();

// POST /api/events/register
// Protected: only authenticated (Google) users can register
router.post("/events/register", authenticate, async (req, res) => {
  try {
    const { eventId, eventName, razorpay_order_id, razorpay_payment_id } =
      req.body;

    if (!eventId || !eventName || !razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ error: "User must be authenticated to register" });
    }

    const registration = await Participant.create({
      name: req.user.username,
      email: req.user.email,
      eventId,
      eventName,
      razorpay_order_id,
      razorpay_payment_id,
    });

    return res
      .status(201)
      .json({ success: true, registrationId: registration._id });
  } catch (err) {
    console.error("Event registration error:", err);
    return res.status(500).json({ error: "Failed to register for event" });
  }
});

module.exports = router;
