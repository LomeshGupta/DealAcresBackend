const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  img: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
    // required: true,
  },
  role: {
    type: String,
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

module.exports = Testimonial;
