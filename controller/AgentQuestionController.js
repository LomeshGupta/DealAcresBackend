// controllers/questionController.js
const Question = require('../models/AgentQuestionModel');
const User = require('../models/userModel');

exports.askQuestion = async (req, res) => {
    try {
        const { userId, agentId, content } = req.body;
        const question = new Question({ user: userId, agent: agentId, content });
        await question.save();
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getQuestionsForAgent = async (req, res) => {
    try {
        const agentId = req.params.agentId;
        const questions = await Question.find({ agent: agentId }).populate('user', 'username').populate('replies');
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
