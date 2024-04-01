const mongoose = require("mongoose");

// Define the blog post schema
const blogSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId, 
    auto: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Blog model
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
