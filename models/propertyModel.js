const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  permalink: { type: String, required: true, unique: true },
  price: { type: Number },
  areaSize: { type: Number },
  sizePostfix: { type: String },
  landArea: { type: Number },
  landAreaSizePostfix: { type: String },
  address: { type: String },
  zipPostalCode: { type: String },
  typeOfProperty: { type: String },
  Status: {
    type: String,
    enum: ["Open", "Close"],
    default: "Open",
  },
  feature: { type: String },
  label: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  area: { type: String },
  featureImage: { type: String },
  content: { type: String },
  floorPlanImages: {
    type: [{}],
  },
  otherImages: {
    type: [{}],
  },
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
