const express = require("express");
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  sendResetOtp,
  verifyResetOtp,
} = require("../controllers/otpController");

// signup/login OTP
router.post("/send", sendOtp);
router.post("/verify", verifyOtp);

// forgot‑password OTP
router.post("/send-for-reset", sendResetOtp);
router.post("/verify-reset", verifyResetOtp);

module.exports = router;
