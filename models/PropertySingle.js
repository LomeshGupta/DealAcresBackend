const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propSingleSchema = new Schema({
    images: { type: [String], required: true },
    floorPlan: { type: String, required: true },
    status: { type: String, required: true },
    title: { type: String, required: true },
    location: { 
        locality: { type: String, required: true },
        city: { type: String, required: true }
    },
    price: { type: Number, required: true },
    aboutProject: { type: String, required: true },
    projectArea: { type: String, required: true },
    sizes: { type: String, required: true },
    projectSize: { type: String, required: true },
    launchDate: { type: Date, required: true },
    avgPrice: { type: Number, required: true },
    possessionStatus: { type: String, required: true },
    configuration: { type: String, required: true },
    address: { type: String, required: true },
    specification: { type: String, required: true },
    amenities: { type: String, required: true },
    aboutDeveloper: { type: String, required: true },
    localityOverview: { type: String, required: true }
});

module.exports = mongoose.model('propSingle', propSingleSchema);