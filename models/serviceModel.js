const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a service name"],
    },
    HeroImg: {
      type: String,
    },
    experts: [
      {
        name: String,
        address: String,
        img: String,
        contact: String,
      },
    ],
    content: [
      {
        title: String,
        desc: String,
        img: String,
      },
    ],
    faq: [
      {
        Q: String,
        A: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
