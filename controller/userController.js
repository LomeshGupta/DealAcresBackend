// Import the User model
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dmen2qi7t",
  api_key: "426686656792964",
  api_secret: "xTxrl7ezipvf-fuWZ-Gm33wDvL0",
});

// Controller functions for user operations
const userController = {
  // Create a new user
  createUser: async (req, res) => {
    let fileData = [];
    try {
      for (const file of req.files) {
        try {
          const uploadedFile = await cloudinary.uploader.upload(file.path, {
            folder: "blogs_dealacres",
            public_id: `${Date.now()}-${file.originalname}`,
            resource_type: "auto",
          });
          fileData.push({
            fileName: file.originalname,
            filePath: uploadedFile.secure_url,
            fileId: uploadedFile.public_id,
            fileType: file.mimetype,
            fileSize: fileSizeFormatter(file.size, 2),
          });
        } catch (uploadError) {
          // Handle Cloudinary upload error
          console.error("Cloudinary upload error:", uploadError);
          return res
            .status(500)
            .json({ message: "Error uploading file to Cloudinary." });
        }
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Create a new user with hashed password
      const newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
        role: req.body.role,
        agency: req.body.agency,
        licenseNumber: req.body.licenseNumber,
        properties: req.body.properties,
        image: fileData,
      });

      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update user by ID
  updateUserById: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete user by ID
  deleteUserById: async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (deletedUser) {
        res.json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Controller for handling user likes
  likeUser: async (req, res, next) => {
    const { userId } = req.params; // Assuming userId is passed in the request parameters
    const { likerId } = req.body; // Assuming likerId (the user who liked) is passed in the request body

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.likes.includes(likerId)) {
        return res.status(400).json({ message: "User already liked" });
      }

      user.likes.push(likerId);
      await user.save();

      return res.status(200).json({ message: "User liked successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: err });
    }
  },

  // Controller for handling user ratings
  rateUser: async (req, res, next) => {
    const { userId } = req.params; // Assuming userId is passed in the request parameters
    const { raterId, rating } = req.body; // Assuming raterId (the user who rated) and rating are passed in the request body

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingRating = user.ratings.find(
        (r) => r.user.toString() === raterId
      );

      if (existingRating) {
        return res.status(400).json({ message: "User already rated" });
      }

      user.ratings.push({ user: raterId, rating });
      await user.save();

      return res.status(200).json({ message: "User rated successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: err });
    }
  },
};

module.exports = userController;
