const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const XLSX = require("xlsx");
const cloudinary = require("cloudinary").v2;
const { fileSizeFormatter } = require("../utils/fileUpload");
const multer = require("multer");

cloudinary.config({
  cloud_name: "dmen2qi7t",
  api_key: "426686656792964",
  api_secret: "xTxrl7ezipvf-fuWZ-Gm33wDvL0",
});

const upload = multer({ storage: multer.memoryStorage() });

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
          console.error("Cloudinary upload error:", uploadError);
          return res
            .status(500)
            .json({ message: "Error uploading file to Cloudinary." });
        }
      }

      // Check if loginType is provided
      const { loginType } = req.body;
      if (!loginType || !["Password", "OTP"].includes(loginType)) {
        return res.status(400).json({
          message: "Invalid or missing loginType. Must be 'Password' or 'OTP'.",
        });
      }

      let hashedPassword = null;

      // If loginType is 'Password', hash the password
      if (loginType === "Password") {
        if (!req.body.password) {
          return res.status(400).json({
            message: "Password is required for loginType 'Password'.",
          });
        }
        hashedPassword = await bcrypt.hash(req.body.password, 10);
      }

      // Create a new user
      const newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword, // Set to null if OTP login
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
        loginType: loginType, // Store loginType
      });

      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
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
    const { userId } = req.params;
    const { likerId } = req.body;

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
    const { userId } = req.params;
    const { raterId, rating } = req.body;

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

  // Upload Excel file and create users
  uploadExcel: async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).send("No file uploaded.");
      }

      const workbook = XLSX.read(file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const users = worksheet.map((row) => ({
        username: row.username,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        password: bcrypt.hashSync(row.password, 10),
        phone: row.phone,
        address: row.address,
        city: row.city,
        state: row.state,
        zipCode: row.zipCode,
        role: row.role,
        agency: row.agency,
        licenseNumber: row.licenseNumber,
        image: row.image,
        experience: row.experience,
        cities: row.cities ? row.cities.split(",") : [],
        description: row.description,
        chairman: row.chairman,
        chairmanMessage: row.chairmanMessage,
        mission: row.mission,
        vision: row.vision,
        faqData: row.faqData ? JSON.parse(row.faqData) : [],
      }));

      await User.insertMany(users);

      res.status(200).send("Users uploaded successfully");
    } catch (error) {
      console.error("Error uploading users:", error.message);
      res.status(500).send("Error uploading users: " + error.message);
    }
  },

  // Delete all users
  deleteAllUsers: async (req, res) => {
    try {
      await User.deleteMany({});
      res.status(200).json({ message: "All users deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting users", error: error.message });
    }
  },
};

module.exports = userController;
