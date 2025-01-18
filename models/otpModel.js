const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  otp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

const OTP = mongoose.models.OTP || mongoose.model("OTP", otpSchema);

module.exports = OTP;
