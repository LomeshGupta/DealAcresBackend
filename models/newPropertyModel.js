const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newPropertySchema = new Schema({
  imageContainer: {
    mainPic: { type: String, required: true },
    sidePics:{ type: [{}] },
    imageCarasouel: { type: [{}] },
  },
  mainContent: {
    title: { type: String, required: true },
    sideTitle: { type: String, required: true },
    currentStatus: { type: String, required: true },
    price: { type: String, required: true },
    about: { type: String, required: true },
    overview: {
      projectArea: { type: String, required: true },
      launchDate: { type: String, required: true },
      configuration: { type: String, required: true },
      sizes: { type: String, required: true },
      avgPrice: { type: String, required: true },
      projectSize: { type: String, required: true },
      possessionStatus: { type: String, required: true }
    },
    specification: {
      Parking: { parkingInfo: [{ type: String, required: true }] },
      Interior: {
        virtualTour: [{ type: String, required: true }],
        bathroomInfo: [{ type: String, required: true }],
        bedroomInfo: [{ type: String, required: true }],
        roomInfo: [{ type: String, required: true }],
        addRoomInfo: [{ type: String, required: true }],
        interiorFeatures: [{ type: String, required: true }]
      }
    },
    Amenities: [{ type: Number, required: true }],
    mapCoordinates: {
      latitude: { type: String, required: true },
      longitude: { type: String, required: true }
    },
    aboutDeveloper: {
      logoSrc: { type: String, required: true },
      developerInfo: { type: String, required: true }
    },
    localityOverview: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      introduction: { type: String, required: true },
      Pros: [{ type: String, required: true }],
      Cons: [{ type: String, required: true }]
    },
    FaqData: [{
      Q: { type: String, required: true },
      A: { type: String, required: true }
    }]
  }
});

const NewProperty = mongoose.model('NewProperty', newPropertySchema);

module.exports = NewProperty;
