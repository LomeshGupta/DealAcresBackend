const Blog = require('../models/blogModel');

// Controller function to create a new blog post
exports.createBlogPost = async (req, res) => {
  try {
    const { title, content, author, image } = req.body;
    const newBlogPost = new Blog({ title, content, author, image });
    const savedBlogPost = await newBlogPost.save();
    res.status(201).json(savedBlogPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get all blog posts
exports.getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await Blog.find().populate('author', 'name email'); // Populate author field with user's name and email
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get a single blog post by ID
exports.getBlogPostById = async (req, res) => {
  try {
    const blogPost = await Blog.findById(req.params.id).populate('author', 'name email');
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to update a blog post by ID
exports.updateBlogPostById = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const updatedBlogPost = await Blog.findByIdAndUpdate(req.params.id, { title, content, image }, { new: true });
    if (!updatedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(updatedBlogPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to delete a blog post by ID
exports.deleteBlogPostById = async (req, res) => {
  try {
    const deletedBlogPost = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
