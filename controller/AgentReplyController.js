// controllers/replyController.js
const Reply = require('../models/AgentReply');
const Question = require('../models/AgentQuestionModel');
const User = require('../models/userModel');

exports.replyToQuestion = async (req, res) => {
    try {
        const { questionId, agentId, content } = req.body;
        const reply = new Reply({ question: questionId, agent: agentId, content });
        await reply.save();

        // Add the reply to the question's replies array
        const question = await Question.findById(questionId);
        question.replies.push(reply._id);
        await question.save();

        res.status(201).json(reply);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
