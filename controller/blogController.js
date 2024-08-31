const Blog = require("../models/blogModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;
const xlsx = require("xlsx");
const fs = require("fs");

cloudinary.config({
  cloud_name: "dmen2qi7t",
  api_key: "426686656792964",
  api_secret: "xTxrl7ezipvf-fuWZ-Gm33wDvL0",
});

// Controller function to create a new blog post
exports.createBlogPost = async (req, res) => {
  try {
    const {
      HeroImg,
      Category,
      Tags,
      Title,
      Subtitle,
      Content,
      FAQs,
      Date,
      Author,
    } = req.body;

    // Log the incoming data to debug
    console.log("Request Data:", req.body);

    const newBlogPost = new Blog({
      HeroImg,
      Category,
      Tags: Array.isArray(Tags) ? Tags : Tags.split(","),
      Title,
      Subtitle,
      Content: Array.isArray(Content) ? Content : JSON.parse(Content),
      FAQs: Array.isArray(FAQs) ? FAQs : JSON.parse(FAQs),
      Date,
      Author,
    });

    const savedBlogPost = await newBlogPost.save();
    res.status(201).json(savedBlogPost);
  } catch (error) {
    console.error("Internal server error:", error);
    res
      .status(500)
      .json({ message: error.message || "Internal server error." });
  }
};

exports.uploadExcelFile = async (req, res) => {
  try {
    // Check if an Excel file is provided
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Parse the Excel file
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Process each row in the Excel file
    const blogPosts = jsonData.map((row) => ({
      HeroImg: row.HeroImg,
      Category: row.Category,
      Tags: row.Tags ? row.Tags.split(",") : [],
      Title: row.Title,
      Subtitle: row.Subtitle,
      Content: row.Content ? JSON.parse(row.Content) : [],
      FAQs: row.FAQs ? JSON.parse(row.FAQs) : [],
      Date: row.Date || Date.now(),
      Author: row.Author,
    }));

    // Save blog posts to the database
    const savedBlogPosts = await Blog.insertMany(blogPosts);

    // Delete the uploaded Excel file after processing
    fs.unlinkSync(req.file.path);

    // Respond with the saved blog posts
    res.status(201).json(savedBlogPosts);
  } catch (error) {
    console.error("Error processing Excel file:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Function to get all blog posts
exports.getAllBlogPosts = async (req, res) => {
  try {
    const { sort, range, filter, category, tag } = req.query;
    const conditions = {};

    // Handle filter query
    if (filter) {
      Object.assign(conditions, JSON.parse(filter));
    }

    // Handle category and tag filtering
    if (category) {
      conditions.Category = category;
    }
    if (tag) {
      conditions.Tags = tag;
    }

    let sortOptions = {};

    // Handle sorting
    if (sort) {
      const [field, order] = JSON.parse(sort);
      sortOptions[field] = order === "ASC" ? 1 : -1;
    }

    // Get the total count of documents
    const totalCount = await Blog.countDocuments(conditions);

    let paginationOptions = {};

    // Handle pagination
    if (range) {
      const [start, end] = JSON.parse(range);
      paginationOptions.skip = start;
      paginationOptions.limit = end - start + 1;
    }

    // Fetch the blog posts
    const blogPosts = await Blog.find(conditions)
      .sort(sortOptions)
      .skip(paginationOptions.skip)
      .limit(paginationOptions.limit);

    // Set the content range header
    const startRange = paginationOptions.skip;
    const endRange = startRange + blogPosts.length - 1;
    const contentRange = `posts ${startRange}-${endRange}/${totalCount}`;

    res.setHeader("Content-Range", contentRange);
    res.setHeader("Access-Control-Expose-Headers", "Content-Range");

    // Return the blog posts
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get a single blog post by ID
exports.getBlogPostById = async (req, res) => {
  try {
    const blogPost = await Blog.findById(req.params.id).populate(
      "Author",
      "name email"
    );
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to update a blog post by ID
exports.updateBlogPostById = async (req, res) => {
  try {
    const {
      HeroImg,
      Category,
      Tags,
      Title,
      Subtitle,
      Content,
      FAQs,
      Date,
      Author,
    } = req.body;

    if (!req.params.id) {
      return res.status(400).json({ message: "Invalid blog post ID" });
    }

    const updatedBlogPost = await Blog.findByIdAndUpdate(
      req.params.id,
      { HeroImg, Category, Tags, Title, Subtitle, Content, FAQs, Date, Author },
      { new: true }
    );

    if (!updatedBlogPost) {
      return res.status(404).json({ message: "Blog post not found" });
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
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete all blog posts
exports.deleteAllBlogPosts = async (req, res) => {
  try {
    // Delete all blog posts
    const result = await Blog.deleteMany({});

    // Return a success message with the number of deleted documents
    res.status(200).json({
      message: `Successfully deleted ${result.deletedCount} blog posts.`,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};
