var mongoose = require("mongoose");

var serviceSchema = mongoose.Schema;

var serviceDetail = new serviceSchema(
  {
    name: {
      type: String,
      require: [true, "Please add a service name"],
    },
    description: {
      type: String,
      require: [true, "Please add description"],
    },
    path: {
      type: String,
      require: [true, "Please add your email id"],
    },
    image_url: {
      type: [{}],
      require: [true, "Please add your image url"],
    },
  },
  {
    timestamps: true,
  }
);
const Service = mongoose.model("Service", serviceDetail);
module.exports = Service;
