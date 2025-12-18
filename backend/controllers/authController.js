const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

/**
 * Generate JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * Local Signup - Name + Password only (no email)
 */
exports.localSignup = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Validation
    if (!name || !password) {
      return res.status(400).json({ message: "Name and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user with same name already exists (local auth)
    const exists = await User.findOne({ name, authProvider: "local" });
    if (exists) {
      return res.status(400).json({ message: "User with this name already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      password: hashedPassword,
      authProvider: "local",
    });

    // Generate token
    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        authProvider: newUser.authProvider,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Local Login - Name + Password
 */
exports.localLogin = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Validation
    if (!name || !password) {
      return res.status(400).json({ message: "Name and password are required" });
    }

    // Find user by name (local auth only)
    const user = await User.findOne({ name, authProvider: "local" });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        authProvider: user.authProvider,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Generate a random strong password for Google OAuth users
 */
const generateSecurePassword = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Google OAuth Callback Handler with Form Data
 * Creates or updates user with Google profile data + form data from signup page
 * @param {Object} profile - Google OAuth profile
 * @param {Object} formData - Form data from signup page (name, password) or null
 */
exports.handleGoogleAuthWithFormData = async (profile, formData) => {
  try {
    const email = profile.emails?.[0]?.value;
    const googleName = profile.displayName;
    const picture = profile.photos?.[0]?.value;
    const googleId = profile.id;

    if (!email) {
      throw new Error("Email not provided by Google");
    }

    // ALWAYS use form data name for signup flow (required from signup page)
    // The signup page requires name field, so formData.name should always exist
    let name;
    if (formData && formData.name && formData.name.trim().length >= 2) {
      // Use name from signup form (trimmed and validated)
      name = formData.name.trim();
      console.log("✅ Using name from signup form:", name);
    } else if (formData && formData.name) {
      // Form data exists but name is too short - still use it but log warning
      name = formData.name.trim();
      console.log("⚠️ Form name is short, but using it:", name);
    } else {
      // No form data - this shouldn't happen in signup flow, but fallback to Google name
      name = googleName;
      console.log("⚠️ No form name found, using Google name as fallback:", name);
    }

    console.log("📝 Processing Google Auth with form data:", {
      email,
      formName: formData?.name,
      googleName,
      finalName: name,
      hasFormPassword: !!formData?.password,
    });

    // Check if user exists by email
    let user = await User.findOne({ email });

    if (user) {
      console.log("👤 User exists, updating...");
      // User exists - update if needed
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (!user.picture && picture) {
        user.picture = picture;
      }
      
      // ALWAYS update name from form data if provided (signup flow)
      if (formData?.name && formData.name.trim().length > 0) {
        user.name = formData.name.trim();
        console.log("✅ Updated name from signup form:", user.name);
      }

      // If form data has password, update it (for signup flow)
      if (formData?.password) {
        const hashedPassword = await bcrypt.hash(formData.password, 10);
        user.password = hashedPassword;
        console.log("✅ Updated password from signup form");
      }

      await user.save();
      console.log("✅ User updated successfully with name:", user.name);
    } else {
      console.log("🆕 Creating new user...");
      // Create new user with Google data + form data
      let passwordToHash;

      if (formData?.password) {
        // Use password from signup form
        passwordToHash = formData.password;
        console.log("✅ Using password from signup form");
      } else {
        // Generate a secure random password if no form data
        passwordToHash = generateSecurePassword();
        console.log("⚠️ No form password, generating secure password");
      }

      const hashedPassword = await bcrypt.hash(passwordToHash, 10);

      user = await User.create({
        name, // This will be form name if available, otherwise Google name
        email,
        password: hashedPassword, // Always store hashed password
        authProvider: "google",
        picture,
        googleId,
      });

      console.log("✅ New user created:", {
        id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        hasPassword: !!user.password,
        nameSource: formData?.name ? "signup form" : "Google profile",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        authProvider: user.authProvider,
      },
      token,
      formData, // Pass formData through for reference if needed
    };
  } catch (error) {
    console.error("❌ Google Auth Error:", error);
    throw error;
  }
};
