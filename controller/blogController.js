const Blog = require("../models/blogModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;
const xlsx = require("xlsx");
const fs = require("fs");
const { error } = require("console");
const multer = require("multer");

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dmen2qi7t",
  api_key: "426686656792964",
  api_secret: "xTxrl7ezipvf-fuWZ-Gm33wDvL0",
});

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

upload.fields([{ name: "HeroImg", maxCount: 1 }]),
  (exports.uploadExcelFile = async (req, res) => {
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
  });

// Controller function to create a new blog post
exports.createBlogPost = async (req, res) => {
  try {
    const {
      Category = "Uncategorized",
      Tags = "",
      Title = "Untitled",
      Subtitle = "",
      Manual = "",
      FAQs = "[]",
      Date = new Date(),
      Author = "Anonymous",
    } = req.body;

    // Function to upload to Cloudinary
    const uploadToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              return reject(error.message);
            }
            console.log("Uploaded to Cloudinary:", result.secure_url);
            resolve(result.secure_url);
          }
        );
        uploadStream.end(buffer);
      });
    };

    // Log request details
    console.log("Request Body:", req.body);
    if (req.files) {
      console.log("Uploaded Files:", req.files);
    } else {
      console.log("No files uploaded.");
    }

    // Process tags
    const processedTags = Array.isArray(Tags)
      ? Tags
      : Tags.split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);

    // Construct Content array from request body
    const contentKeys = Object.keys(req.body).filter((key) =>
      key.startsWith("Content[")
    );

    const processedContent = [];
    contentKeys.forEach((key) => {
      const match = key.match(/^Content\[(\d+)\]\.(.+)$/);
      if (match) {
        const [, index, field] = match;
        if (!processedContent[index]) {
          processedContent[index] = {};
        }
        processedContent[index][field] = req.body[key];
      }
    });

    // Upload HeroImg to Cloudinary
    let uploadedHeroImgUrl = "";
    let heroImgUploadedCount = 0;
    const heroImgFile = req.files?.find((file) => file.fieldname === "HeroImg");
    if (heroImgFile) {
      try {
        uploadedHeroImgUrl = await uploadToCloudinary(heroImgFile.buffer);
        heroImgUploadedCount++;
      } catch (err) {
        console.error("Failed to upload Hero Image:", err);
      }
    } else {
      console.log("No HeroImg file found in the request");
    }

    // Upload images in Content array to Cloudinary
    let contentImgUploadedCount = 0;
    const uploadedContentImages = await Promise.all(
      processedContent.map(async (item, index) => {
        const contentImgFile = req.files?.find(
          (file) => file.fieldname === `Content[${index}].img`
        );
        if (contentImgFile) {
          try {
            const imgUrl = await uploadToCloudinary(contentImgFile.buffer);
            contentImgUploadedCount++;
            return { ...item, img: imgUrl };
          } catch (err) {
            console.error(`Error uploading image for Content[${index}]:`, err);
            throw new Error("Failed to upload content image.");
          }
        }
        return item; // If no image, return the item as is
      })
    );

    // Create a new blog post
    const newBlogPost = new Blog({
      HeroImg: uploadedHeroImgUrl,
      Category,
      Tags: processedTags,
      Title,
      Subtitle,
      Manual,
      Content: uploadedContentImages, // Use the updated content with image URLs
      FAQs: JSON.parse(FAQs),
      Date,
      Author,
    });

    const savedBlogPost = await newBlogPost.save();

    res.status(201).json({
      message: "Blog post created successfully.",
      savedBlogPost,
      uploadedImagesCount: {
        heroImage: heroImgUploadedCount,
        contentImages: contentImgUploadedCount,
      },
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({
      message: error.message || "Internal server error.",
      errorStack: error.stack,
    });
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
      Category,
      Tags,
      Title,
      Subtitle,
      Manual,
      Content = [],
      FAQs,
      Date,
      Author,
    } = req.body;

    if (!req.params.id) {
      return res.status(400).json({ message: "Invalid blog post ID" });
    }

    // console.log("Request body:", req.body);
    // console.log("Files:", req.files); // Log to ensure files are being received

    const uploadToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) {
              return reject("Cloudinary Upload Error: " + error.message);
            }
            resolve(result.secure_url);
          }
        );
        uploadStream.end(buffer);
      });
    };

    let HeroImgUrl = null;

    const heroImgFile = req.files?.find((file) => file.fieldname === "HeroImg");

    if (heroImgFile) {
      HeroImgUrl = await uploadToCloudinary(heroImgFile);
    } else {
      console.log("No HeroImg file found in the request");
    }

    const updatedContent = await Promise.all(
      Content.map(async (section, index) => {
        console.log("Content section:", section);

        const contentImgFile = req.files?.find(
          (file) => file.fieldname === `Content[${index}][img]`
        );

        if (contentImgFile) {
          const imgUrl = await uploadToCloudinary(contentImgFile.buffer);
          section.img = imgUrl;
        }

        return section;
      })
    );

    const updatedData = {
      Category,
      Tags: Tags ? Tags.split(",") : [],
      Title,
      Subtitle,
      Manual,
      Content: updatedContent,
      FAQs: FAQs ? JSON.parse(FAQs) : [],
      Date,
      Author,
    };

    if (HeroImgUrl) {
      updatedData.HeroImg = HeroImgUrl;
    }

    const updatedBlogPost = await Blog.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedBlogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json(updatedBlogPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
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
