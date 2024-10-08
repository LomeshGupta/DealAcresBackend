const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authMiddleware = require("../Middleware/adminMiddleware");
const authMiddleware1 = require("../Middleware/authMiddleware");
const { upload } = require("../utils/fileUpload");
const multer = require("multer");
const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });

// Create a new user (registration)
router.post("/", upload.array("image"), userController.createUser);

// Get all users (admin only)
router.get("/", userController.getAllUsers);

// Get user by ID (admin only)
router.get("/:id", userController.getUserById);

// Update user by ID (admin only)
router.put("/:id", authMiddleware, userController.updateUserById);

// Delete user by ID (admin only)
router.delete("/:id", authMiddleware, userController.deleteUserById);

// Route for liking a user
router.post("/:id/like", authMiddleware1, userController.likeUser);

// Route for rating a user
router.post("/:id/rate", authMiddleware1, userController.rateUser);

// Route for Excel Uplo
router.post("/upload", uploads.single("file"), userController.uploadExcel);

//Route for Deleting All Users
router.delete("/", userController.deleteAllUsers);

module.exports = router;
