const express = require("express");
const { sendOTP, verifyOTP } = require("../controller/otpController");

const router = express.Router();

// Send OTP route
router.post("/send", sendOTP);

// Verify OTP route
router.post("/verify", verifyOTP);

module.exports = router;
