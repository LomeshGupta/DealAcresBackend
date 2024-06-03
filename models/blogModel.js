const mongoose = require("mongoose");

// Define the blog post schema
const blogSchema = new mongoose.Schema({
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
  image: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  tags: [{
    type: String,
  }],
  dateOfBlogPosted: {
    type: Date,
  },
  featuredBlog: {
    type: String,
    enum: ['popular post', 'latest post', 'relevant articles'],
  },
});

// Create the Blog model
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
