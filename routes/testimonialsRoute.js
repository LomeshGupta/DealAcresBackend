// routes/router.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const testimonialController = require("../controller/testimonialController");

// CRUD operations for testimonials
router.post("/", testimonialController.createTestimonial);
router.get("/", testimonialController.getAllTestimonials);
router.get("/:id", testimonialController.getTestimonialById);
router.put("/:id", testimonialController.updateTestimonial);
router.delete("/:id", testimonialController.deleteTestimonial);
router.delete("/", testimonialController.deleteAllTestimonials);

// Excel uploader route
router.post(
  "/upload",
  upload.single("file"),
  testimonialController.uploadExcel
);

module.exports = router;
