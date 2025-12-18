const express = require("express");
const passport = require("../config/passport");

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

      const redirectURL =
        `${FRONTEND_URL}/auth/success?token=${encodeURIComponent(token)}` +
        `&name=${encodeURIComponent(user.name)}` +
        (user.email ? `&email=${encodeURIComponent(user.email)}` : "") +
        (user.picture ? `&picture=${encodeURIComponent(user.picture)}` : "") +
        `&authProvider=${encodeURIComponent(user.authProvider)}`;

      return res.redirect(redirectURL);
    } catch (error) {
      console.error("❌ Error in Google OAuth callback:", error);
      return res.redirect(`${FRONTEND_URL}/signup?error=auth_failed`);
    }
  }
);

module.exports = router;
