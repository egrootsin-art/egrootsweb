const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: false, unique: true, sparse: true }, // Optional, unique when present
    password: { type: String, required: true }, // Always required (hashed)
    authProvider: {
      type: String,
      enum: ["local", "google"],
      required: true,
      default: "local",
    },
    googleVerified: { type: Boolean, default: false },
    picture: { type: String, required: false }, // Optional profile picture from Google
    googleId: { type: String, required: false }, // Google user ID
  },
  { timestamps: true }
);

// Index for name-based lookups (for local auth)
userSchema.index({ name: 1, authProvider: 1 });

// Index for email-based lookups (for Google auth)
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
