const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    locality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Locality',
        required: true
    }
});

const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;