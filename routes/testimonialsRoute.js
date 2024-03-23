const express = require("express");
const router = express.Router();
const testimonialController = require('../controller/testimonialController');

// Route to create a new testimonial
router.post('/', testimonialController.createTestimonial);

// Route to get all testimonials
router.get('/', testimonialController.getAllTestimonials);

// Route to get a single testimonial by ID
router.get('/:id', testimonialController.getTestimonialById);

// Route to update a testimonial by ID
router.put('/:id', testimonialController.updateTestimonial);

// Route to delete a testimonial by ID
router.delete('/:id', testimonialController.deleteTestimonial);

module.exports = router;
