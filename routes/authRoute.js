// Import necessary packages
const express = require('express');
const router = express.Router();
const updateLoggedInStatus = require('../Middleware/updateLoggedInStatus');
const authController = require('../controller/authController');

// Apply middleware globally
router.use(updateLoggedInStatus);

// Login user
router.post('/login', authController.login);

// Logout user
router.post('/logout', authController.logout);

module.exports = router;
