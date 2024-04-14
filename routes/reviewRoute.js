const express = require('express');
const router = express.Router();
const reviewController = require('../controller/reviewController');
const authMiddleware = require('../Middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', reviewController.createReview);
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);
router.patch('/:id', reviewController.updateReviewById);
router.delete('/:id', reviewController.deleteReviewById);

module.exports = router;
