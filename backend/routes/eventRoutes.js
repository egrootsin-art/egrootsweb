// backend/routes/eventRoutes.js
const express = require("express");
const Participant = require("../models/Participant");

const router = express.Router();

// POST /api/events/register
router.post("/events/register", async (req, res) => {
  try {
    const { eventId, eventName, name, email, password } = req.body;

    if (!eventId || !eventName || !name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    

    const registration = await Participant.create({
      name,
      email,
      password,
    });

    return res.status(201).json({ success: true, registrationId: registration._id });
  } catch (err) {
    console.error("Event registration error:", err);
    return res.status(500).json({ error: "Failed to register for event" });
  }
});

module.exports = router;
