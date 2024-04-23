const Blog = require("../models/blogModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dmen2qi7t",
  api_key: "426686656792964",
  api_secret: "xTxrl7ezipvf-fuWZ-Gm33wDvL0",
});

// Controller function to create a new blog post
exports.createBlogPost = async (req, res) => {
  let fileData = [];
  try {
    const { title, content, author } = req.body;

    for (const file of req.files) {
      const uploadedFile = await cloudinary.uploader.upload(file.path, {
        folder: "blogs_dealacres",
        public_id: `${Date.now()}-${file.originalname}`,
        resource_type: "image",
      });
      fileData.push({
        fileName: file.originalname,
        filePath: uploadedFile.secure_url,
        fileId: `${Date.now()}-${file.originalname}`,
        fileType: file.mimetype,
        fileSize: fileSizeFormatter(file.size, 2),
      });
    }

    const newBlogPost = new Blog({ title, content, author, image: fileData });
    const savedBlogPost = await newBlogPost.save();
    res.status(201).json(savedBlogPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// unction to get all blog posts
exports.getAllBlogPosts = async (req, res) => {
  try {
    // Parse query parameters
    const { sort, range, filter } = req.query;

    // Define query conditions
    const conditions = {};

    // Apply filter if provided
    if (filter) {
      Object.assign(conditions, JSON.parse(filter));
    }

    // Define sorting options
    let sortOptions = {};

    // Apply sorting if provided
    if (sort) {
      const [field, order] = JSON.parse(sort);
      sortOptions[field] = order === "ASC" ? 1 : -1;
    }

    // Fetch total count of blog posts (for pagination)
    const totalCount = await Blog.countDocuments(conditions);

    // Define pagination options
    let paginationOptions = {};

    // Apply pagination if provided
    if (range) {
      const [start, end] = JSON.parse(range);
      paginationOptions.skip = start;
      paginationOptions.limit = end - start + 1;
    }

    // Fetch blog posts based on query conditions, sorting, and pagination
    const blogPosts = await Blog.find(conditions)
      .sort(sortOptions)
      .skip(paginationOptions.skip)
      .limit(paginationOptions.limit);

    // Calculate Content-Range header value
    const startRange = paginationOptions.skip;
    const endRange = startRange + blogPosts.length - 1;
    const contentRange = `posts ${startRange}-${endRange}/${totalCount}`;

    // Set Content-Range header in the response
    res.setHeader("Content-Range", contentRange);
    res.setHeader("Access-Control-Expose-Headers", "Content-Range"); // Expose Content-Range header to the client

    // Send response with filtered, sorted, and paginated blog posts
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get a single blog post by ID
exports.getBlogPostById = async (req, res) => {
  try {
    const blogPost = await Blog.findById(req.params.id).populate(
      "author",
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
    const { title, content, image } = req.body;
    const updatedBlogPost = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, image },
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
