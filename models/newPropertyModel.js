const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newPropertySchema = new Schema({
  mainPic: { type: String },
  sidePics: { type: [{}] },
  title: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  PropertyType: [{ type: String }],
  Location: { type: String },
  sideTitle: { type: String },
  Description: { type: String },
  Status: { type: String },
  minprice: { type: Number },
  maxprice: { type: Number },
  overview: {
    projectArea: { type: String },
    launchDate: { type: String },
    configuration: { type: String },
    sizes: { type: String },
    avgPrice: { type: String },
    projectSize: { type: String },
    possessionStatus: { type: String },
  },
  Parking: { type: String },
  virtualTour: [{ type: String }],
  bathroomInfo: [{ type: String }],
  bedroomInfo: [{ type: String }],
  roomInfo: [{ type: String }],
  addRoomInfo: [{ type: String }],
  interiorFeatures: [{ type: String }],
  Amenities: [{ type: Number }],
  latitude: { type: String },
  longitude: { type: String },
  aboutDeveloper: {
    DevId: { type: String },
    logoSrc: { type: String },
    developerInfo: { type: String },
  },
  localityOverview: {
    LocId: { type: String },
    LocaTitle: { type: String },
    LocDescription: { type: String },
    LocPros: [{ type: String }],
    LocCons: [{ type: String }],
  },
  FaqData: [
    {
      Q: { type: String },
      A: { type: String },
    },
  ],
});

const NewProperty = mongoose.model("NewProperty", newPropertySchema);

module.exports = NewProperty;
