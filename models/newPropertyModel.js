const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newPropertySchema = new Schema({
  imageContainer: {
    mainPic: { type: String },
    sidePics: { type: [{}] },
    imageCarasouel: { type: [{}] },
  },
  mainContent: {
    title: { type: String },
    sideTitle: { type: String },
    currentStatus: { type: String },
    price: { type: String },
    about: { type: String },
    overview: {
      projectArea: { type: String },
      launchDate: { type: String },
      configuration: { type: String },
      sizes: { type: String },
      avgPrice: { type: String },
      projectSize: { type: String },
      possessionStatus: { type: String }
    },
    specification: {
      Parking: { parkingInfo: [{ type: String }] },
      Interior: {
        virtualTour: [{ type: String }],
        bathroomInfo: [{ type: String }],
        bedroomInfo: [{ type: String }],
        roomInfo: [{ type: String }],
        addRoomInfo: [{ type: String }],
        interiorFeatures: [{ type: String }]
      }
    },
    Amenities: [{ type: Number }],
    mapCoordinates: {
      latitude: { type: String },
      longitude: { type: String }
    },
    aboutDeveloper: {
      logoSrc: { type: String },
      developerInfo: { type: String }
    },
    localityOverview: {
      title: { type: String },
      subtitle: { type: String },
      introduction: { type: String },
      Pros: [{ type: String }],
      Cons: [{ type: String }]
    },
    FaqData: [{
      Q: { type: String },
      A: { type: String }
    }]
  }
});

const NewProperty = mongoose.model('NewProperty', newPropertySchema);

module.exports = NewProperty;
