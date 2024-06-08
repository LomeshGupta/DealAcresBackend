const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guideSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        city: { type: String, required: true },
        country: { type: String, required: true }
    },
    languagesSpoken: { type: [String], required: true },
    availability: { type: String, required: true }, // e.g., "Weekdays", "Weekends", "Anytime"
    contactInfo: {
        phone: { type: String, required: true },
        email: { type: String, required: true }
    }
});

module.exports = mongoose.model('Guide', guideSchema);