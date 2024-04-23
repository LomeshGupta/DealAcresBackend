const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const authMiddleware = require("../Middleware/authMiddleware");
const { upload } = require("../utils/fileUpload");

router.use(authMiddleware);

// Create a new blog post
router.post("/", upload.array("image"), blogController.createBlogPost);

// Get all blog posts
router.get("/", blogController.getAllBlogPosts);

// Get a single blog post by ID
router.get("/:id", blogController.getBlogPostById);

// Update a blog post by ID
router.put("/:id", blogController.updateBlogPostById);

// Delete a blog post by ID
router.delete("/:id", blogController.deleteBlogPostById);

module.exports = router;
