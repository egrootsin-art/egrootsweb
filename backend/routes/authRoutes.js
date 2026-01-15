const express = require("express");
const { localSignup, localLogin } = require("../controllers/authController");

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user (local auth - name + password)
 * @access  Public
 */
router.post("/signup", localSignup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user (local auth - name + password)
 * @access  Public
 */
router.post("/login", localLogin);

module.exports = router;
