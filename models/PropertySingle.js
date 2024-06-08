const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propSingleSchema = new Schema({
    images: { type: [String] },
    floorPlan: { type: String },
    status: { type: String },
    title: { type: String },
    location: { 
        locality: { type: String },
        city: { type: String }
    },
    price: { type: String },
    aboutProject: { type: String },
    projectArea: { type: String },
    sizes: { type: String },
    projectSize: { type: String },
    launchDate: { type: String },
    avgPrice: { type: String },
    possessionStatus: { type: String },
    configuration: { type: String },
    address: { type: String },
    specification: { type: String },
    amenities: { type: String },
    aboutDeveloper: { type: String },
    localityOverview: { type: String }
});

module.exports = mongoose.model('propSingle', propSingleSchema);
