// models/Reply.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
