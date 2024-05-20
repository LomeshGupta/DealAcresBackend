// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Project = require('../models/ProjectModel');

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  isLoggedIn: { type: Boolean, default: false },
  role: { type: String, enum: ["admin", "user", "agent", "developer"], default: "user" },
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
});

const User = mongoose.model("User", userSchema);

module.exports = User;
