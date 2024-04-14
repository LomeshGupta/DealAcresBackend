const express = require('express');
const router = express.Router();
const faqController = require('../controller/FaqController');
const authMiddleware = require('../Middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', faqController.createFAQ);
router.get('/', faqController.getAllFAQs);
router.get('/:id', faqController.getFAQById);
router.patch('/:id', faqController.updateFAQById);
router.delete('/:id', faqController.deleteFAQById);

module.exports = router;