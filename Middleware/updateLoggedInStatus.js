const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to update isLoggedIn status when token expires
const updateLoggedInStatus = async (req, res, next) => {
  // Get the token from the request header
  const token = req.header("Authorization");

  // Check if token is present
  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user ID to request object for further use in routes
      req.user = decoded;

      // Check if the token is about to expire (within 5 minutes)
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp - currentTime < 300) {
        // Find the user by ID
        const user = await User.findById(decoded.userId);
        if (user) {
          // Update user's login status
          user.isLoggedIn = false;
          await user.save();
        }
      }
    } catch (err) {
      // If token is invalid or expired, ignore and proceed with the request
    }
  }

  next();
};

module.exports = updateLoggedInStatus;
