const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authMiddleware = require('../Middleware/adminMiddleware');

// Create a new user (registration)
router.post('/', userController.createUser);

// Get all users (admin only)
router.get('/', authMiddleware, userController.getAllUsers);

// Get user by ID (admin only)
router.get('/:id', authMiddleware, userController.getUserById);

// Update user by ID (admin only)
router.put('/:id', authMiddleware, userController.updateUserById);

// Delete user by ID (admin only)
router.delete('/:id', authMiddleware, userController.deleteUserById);

module.exports = router;