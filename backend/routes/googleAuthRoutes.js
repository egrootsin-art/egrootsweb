// routes/googleAuthRoutes.js
const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // adjust path if your user model is named differently

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const ADMIN_EMAIL = "bharanidharan.eg26@gmail.com"; // your admin email

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, error: "No token provided" });

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: name || email.split("@")[0],
        email,
        password: null,         // password-based login remains separate
        googleId,
        avatar: picture || null,
        role: email === ADMIN_EMAIL ? "admin" : "user" // optional
      });
    } else {
      // if existing user hasn't saved googleId, set it
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    // Create your app JWT
    const appToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role || "user" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token: appToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role || "user",
        avatar: user.avatar || null
      }
    });
  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(401).json({ success: false, error: "Invalid Google token" });
  }
});

module.exports = router;
