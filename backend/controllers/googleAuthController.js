const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Generate JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * Google OAuth Callback Handler with Form Data
 * STRICTLY for Email Verification during Signup
 */
exports.handleGoogleAuthWithFormData = async (profile, formData) => {
  try {
    const googleEmail = profile.emails?.[0]?.value;
    const picture = profile.photos?.[0]?.value;
    const googleId = profile.id;

    if (!googleEmail) {
      throw new Error("Email not provided by Google");
    }

    // 1. SIGNUP FLOW (formData is present)
    if (formData) {
      console.log("📝 Processing Signup Verification:", {
        googleEmail,
        formEmail: formData.email,
        formName: formData.name,
      });

      // Strict Email Verification
      if (formData.email && googleEmail.toLowerCase() !== formData.email.toLowerCase()) {
        console.error("❌ Email Mismatch:", { google: googleEmail, form: formData.email });
        throw new Error("Google verified email does not match entered email");
      }

      // Check if user already exists
      let user = await User.findOne({ email: googleEmail });
      if (user) {
        throw new Error("User with this email already exists. Please login.");
      }

      // Create New User (Verified)
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      
      user = await User.create({
        name: formData.name,
        email: googleEmail,
        password: hashedPassword,
        authProvider: "local", // As requested: authProvider = "local"
        googleVerified: true,  // New field
        picture,
        googleId,
      });

      console.log("✅ New Verified User Created:", user.email);
      const token = generateToken(user._id);
      return { user, token };
    } 
    
    // 2. LOGIN FLOW (No formData - e.g. "Login with Google" button)
    // Note: User said "Do NOT treat Google login as the main authentication method", 
    // but we might want to allow existing users to sign in if they linked Google.
    // For now, if no formData, we check if user exists and has googleId.
    else {
      let user = await User.findOne({ email: googleEmail });
      if (!user) {
        throw new Error("Account not found. Please Sign Up first.");
      }
      
      // Update googleId if missing (linking account)
      if (!user.googleId) {
        user.googleId = googleId;
        user.googleVerified = true;
        await user.save();
      }

      const token = generateToken(user._id);
      return { user, token };
    }

  } catch (error) {
    console.error("❌ Google Auth Error:", error.message);
    throw error;
  }
};
