const express = require("express");
const multer = require("multer");
const router = express.Router();
const blogController = require("../controller/blogController");
// const authMiddleware = require("../Middleware/authMiddleware");
const { upload } = require("../utils/fileUpload");

const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });

// router.use(authMiddleware);

// Create a new blog post with a Hero Image
router.post("/", blogController.createBlogPost);

// Get all blog posts
router.get("/", blogController.getAllBlogPosts);

// Get a single blog post by ID
router.get("/:id", blogController.getBlogPostById);

// Update a blog post by ID, with the option to upload a new Hero Image
router.put("/:id", blogController.updateBlogPostById);

// Delete a blog post by ID
router.delete("/:id", blogController.deleteBlogPostById);

// Delete all blog posts
router.delete("/", blogController.deleteAllBlogPosts);

// Excel uploader route
router.post(
  "/upload",
  uploads.single("excelFile"),
  blogController.uploadExcelFile
);

module.exports = router;
