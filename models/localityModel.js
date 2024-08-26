const mongoose = require("mongoose");

const LocalitySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  pincode: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ["Residential", "Commercial", "Industrial"],
  },
  landmark: {
    type: String,
    trim: true,
  },
  population_density: {
    type: Number,
  },
  average_property_price: {
    type: Number,
  },
  Amenities: [{ type: Number }],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

LocalitySchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Locality = mongoose.model("Locality", LocalitySchema);

module.exports = Locality;
