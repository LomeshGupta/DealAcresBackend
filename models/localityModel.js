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
  amenities: [{ type: Number }],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  hero_img: {
    type: String,
  },
  side_img: [{ type: String }],
  neighborhood: [{}],
  pros: {
    type: [String],
  },
  cons: {
    type: [String],
  },
  faqs: [
    {
      Q: {
        type: String,
      },
      A: {
        type: String,
      },
    },
  ],
});

LocalitySchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Locality = mongoose.model("Locality", LocalitySchema);

module.exports = Locality;
