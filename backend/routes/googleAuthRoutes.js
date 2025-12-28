const express = require("express");
const passport = require("../config/passport");
// const { handleGoogleAuthWithFormData } = require("../controllers/googleAuthController"); // Not used here directly

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

/**
 * @route   GET /api/auth/google/login
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get("/login", (req, res, next) => {
  // Extract state parameter (contains form data from signup page)
  const state = req.query.state || null;

  // Store state in session for retrieval in callback
  if (state) {
    req.session.oauthState = state;
  }

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: state, // Pass state through OAuth flow
  })(req, res, next);
});

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback handler
 * @access  Public
 */
router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/signup`,
    session: false,
  }),
  async (req, res) => {
    try {
      const { user, token, formData } = req.user; // formData contains name and password from signup form

      // Log for verification
      console.log("✅ Google OAuth callback successful:", {
        userId: user.id,
        name: user.name,
        email: user.email,
        formDataReceived: !!formData,
        formName: formData?.name,
      });

      // Clear session state if it exists
      if (req.session && req.session.oauthState) {
        delete req.session.oauthState;
      }

      

      return res.redirect("/");
    } catch (error) {
      console.error("❌ Error in Google OAuth callback:", error);
      const errorMessage = encodeURIComponent(error.message || "Authentication failed");
      return res.redirect(`${FRONTEND_URL}/signup?error=${errorMessage}`);
    }
  }
);

module.exports = router;
