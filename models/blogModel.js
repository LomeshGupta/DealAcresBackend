const mongoose = require("mongoose");

// Define the blog post schema
const blogSchema = new mongoose.Schema({
  HeroImg: {
    type: String,
  },
  Category: {
    type: String,
  },
  Tags: [
    {
      type: String,
    },
  ],
  Manual: { type: String },
  Title: {
    type: String,
  },
  Subtitle: {
    type: String,
  },
  Content: [
    {
      title: { type: String },
      description: { type: String },
      img: { type: String },
    },
  ],
  FAQs: [],
  Date: {
    type: Date,
    default: Date.now,
  },
  Author: {
    type: String,
  },
});

// Create the Blog model
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
