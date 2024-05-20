const mongoose = require('mongoose');

const localitySchema = new mongoose.Schema({
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    population: {
        type: Number,
        required: true
    },
    area: {
        type: Number,
        required: true
    },
    landmarks: [{
        name: String,
        type: String
    }],
    image: { type: [{}] }
});

// Create a model using the schema
const Locality = mongoose.model('Locality', localitySchema);

// Export the model
module.exports = Locality;
