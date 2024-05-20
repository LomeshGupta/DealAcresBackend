// models/Project.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;