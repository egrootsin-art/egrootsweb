const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Otp = require("../models/Otp");
const User = require("../models/User");

const OTP_EXPIRY_MINUTES = 2;

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ SEND OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Delete old OTPs for this email
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({ email, otp: otpCode, expiresAt });

    // Send email
    await transporter.sendMail({
      from: `"EGROOTS INNOVATE" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code - EGROOTS INNOVATE",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p>Hello,</p>
          <p>Your OTP code is:</p>
          <h1 style="background: #007bff; color: white; padding: 15px; text-align: center; border-radius: 8px; letter-spacing: 5px;">
            ${otpCode}
          </h1>
          <p style="color: #666;">This code is valid for <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">EGROOTS INNOVATE SHOP</p>
        </div>
      `,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ✅ VERIFY OTP & REGISTER USER
exports.verifyOtp = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find OTP record
    const otpDoc = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    // Check expiry
    if (otpDoc.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    // Verify OTP
    if (otpDoc.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if user already exists (edge case)
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Delete OTP after successful registration
    await Otp.deleteMany({ email });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Error verifying OTP:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ SEND OTP FOR PASSWORD RESET
exports.sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Must be an existing user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp: otpCode, expiresAt });

    await transporter.sendMail({
      from: `"EGROOTS INNOVATE" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP - EGROOTS INNOVATE",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>Hello,</p>
          <p>Your OTP code for password reset is:</p>
          <h1 style="background: #007bff; color: white; padding: 15px; text-align: center; border-radius: 8px; letter-spacing: 5px;">
            ${otpCode}
          </h1>
          <p style="color: #666;">This code is valid for <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: "Reset OTP sent successfully" });
  } catch (err) {
    console.error("❌ Error sending reset OTP:", err);
    res.status(500).json({ message: "Failed to send reset OTP" });
  }
};

// ✅ VERIFY RESET OTP & UPDATE PASSWORD
exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password are required" });
    }

    const otpDoc = await Otp.findOne({ email }).sort({ createdAt: -1 });
    if (!otpDoc) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (otpDoc.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    if (otpDoc.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    await Otp.deleteMany({ email });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Error verifying reset OTP:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
