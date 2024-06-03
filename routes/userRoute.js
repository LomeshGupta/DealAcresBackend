const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authMiddleware = require("../Middleware/adminMiddleware");
const authMiddleware1 = require("../Middleware/authMiddleware");
const { upload } = require("../utils/fileUpload");

// Create a new user (registration)
router.post("/", upload.array("image"), userController.createUser);

// Get all users (admin only)
router.get("/", authMiddleware, userController.getAllUsers);

// Get user by ID (admin only)
router.get("/:id", authMiddleware, userController.getUserById);

// Update user by ID (admin only)
router.put("/:id", authMiddleware, userController.updateUserById);

// Delete user by ID (admin only)
router.delete("/:id", authMiddleware, userController.deleteUserById);

// Route for liking a user
router.post("/:id/like", authMiddleware1, userController.likeUser);

// Route for rating a user
router.post("/:id/rate", authMiddleware1, userController.rateUser);

module.exports = router;
