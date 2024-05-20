// models/Location.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  image: [{}],
  coordinates: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  aboutLocality: { type: String },
  neighbourhoodAmenities: [
    {
      category: { type: String },
      amenities: [{ type: String }],
    },
  ],
  prosAndCons: [
    {
      title: { type: String },
      description: { type: String },
    },
  ],
  popularProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  nearbyLocalities: [{ type: String }],
  topDevelopers: [{ type: String }],
  discussion: { type: String },
  blog: [{ type: String }],
  faq: [{ type: String }],
});

locationSchema.index({ coordinates: "2dsphere" });

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
