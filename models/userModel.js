// models/User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Project = require("../models/ProjectModel");

const userSchema = new Schema({
  username: { type: String, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  isLoggedIn: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["admin", "user", "agent", "developer"],
    default: "user",
  },
  agency: { type: String },
  licenseNumber: { type: String },
  properties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  ],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  image: { type: [{}] },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
    },
  ],
  tags: { type: String },
  experience: { type: String },
  cities: { type: [String] },
  description: { type: String },
  chairman: { type: String },
  chairmanMessage: { type: String },
  mission: { type: String },
  vision: { type: String },
  faqData: [
    {
      Q: { type: String },
      A: { type: String },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
