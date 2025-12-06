const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// -------------------------
// GOOGLE STRATEGY
// -------------------------
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
      session: false, // ⭐ IMPORTANT
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            picture: profile.photos[0].value,
            password: null,
          });
        }

        // Generate JWT
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Disable sessions completely
passport.serializeUser(() => {});
passport.deserializeUser(() => {});

// -------------------------
// ROUTES
// -------------------------

// Step 1: Google Login
router.get(
  "/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Step 2: Google Callback
router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:8080/login",
    session: false,
  }),
  (req, res) => {
    const { user, token } = req.user;

    const redirectURL =
      `http://localhost:8080/auth/success?token=${token}` +
      `&email=${user.email}` +
      `&name=${user.name}` +
      `&picture=${user.picture}`;

    return res.redirect(redirectURL);
  }
);

module.exports = router;
