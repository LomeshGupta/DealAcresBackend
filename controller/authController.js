const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv").config();
const { verifyOTP } = require("./otpController");

const authController = {
  // Login user
  login: async (req, res) => {
    const { username, password, loginType, otp } = req.body;
    try {
      // Check if the user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "Invalid user credentials" });
      }

      if (loginType === "OTP") {
        const phone = username;
        // Verify OTP
        const isOtpValid = await verifyOTP(phone, otp);
        if (!isOtpValid) {
          return res.status(400).json({ message: "Invalid OTP" });
        }
      } else {
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Update user's login status
      user.isLoggedIn = true;
      await user.save();

      // Set token in HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000, // 1 hour
        secure: process.env.NODE_ENV === "production",
      });

      res.json({ id: user._id, token, message: "Login successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Logout user
  logout: async (req, res) => {
    try {
      // Clear token cookie
      res.clearCookie("token");

      // Find the user by ID
      const user = await User.findById(req.body.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user's login status
      user.isLoggedIn = false;
      await user.save();

      res.json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authController;
