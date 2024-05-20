const express = require('express');
const router = express.Router();
const questionController = require("../controller/AgentQuestionController");
const replyController = require('../controller/AgentReplyController');

// Question routes
router.post('/ask', questionController.askQuestion);
router.get('/:agentId', questionController.getQuestionsForAgent);

// Reply routes
router.post('/reply', replyController.replyToQuestion);

module.exports = router;
