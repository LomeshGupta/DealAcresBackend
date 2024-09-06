const express = require("express");
const { ValidationError, CastError } = require("mongoose").Error;
const router = express.Router();
const xlsx = require("xlsx");
const NewProperty = require("../models/newPropertyModel");
const cloudinary = require("cloudinary").v2;
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

exports.createProperty = [
  // Multer middleware for handling file uploads
  upload.fields([
    { name: "mainPic", maxCount: 1 },
    { name: "sidePics", maxCount: 10 },
  ]),

  async (req, res) => {
    try {
      const {
        title = "",
        address = "",
        city = "",
        state = "",
        pincode = "",
        PropertyType = "",
        Location = "",
        sideTitle = "",
        Description = "",
        Status = "",
        minprice = 0,
        maxprice = 0,
        overview = {},
        Parking = "",
        bathroomInfo = "[]",
        bedroomInfo = "[]",
        roomInfo = "[]",
        interiorFeatures = "[]",
        exteriorFeatures = "[]",
        otherFeatures = "[]",
        Amenities = "[]",
        latitude = "",
        longitude = "",
        aboutDeveloper = "{}",
        localityOverview = "{}",
        FaqData = "[]",
      } = req.body;

      // Check if mainPic is uploaded
      if (
        !req.files ||
        !req.files["mainPic"] ||
        req.files["mainPic"].length === 0
      ) {
        return res.status(400).json({ message: "Main picture is required." });
      }

      // Function to upload a single image to Cloudinary and return the URL
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

      // Upload mainPic to Cloudinary
      const mainPicUrl = await uploadToCloudinary(
        req.files["mainPic"][0].buffer
      );

      // Upload sidePics to Cloudinary (if present)
      const sidePicsUrls = [];
      if (req.files["sidePics"]) {
        for (const file of req.files["sidePics"]) {
          const sidePicUrl = await uploadToCloudinary(file.buffer);
          sidePicsUrls.push(sidePicUrl);
        }
      }

      // Create a new property object
      const newProperty = new NewProperty({
        mainPic: mainPicUrl,
        sidePics: sidePicsUrls,
        title,
        address,
        city,
        state,
        pincode,
        PropertyType: PropertyType.split(","),
        Location,
        sideTitle,
        Description,
        Status,
        minprice,
        maxprice,
        overview: {
          projectArea: overview.projectArea || "",
          launchDate: overview.launchDate || "",
          configuration: overview.configuration || "",
          sizes: overview.sizes || "",
          avgPrice: overview.avgPrice || "",
          projectSize: overview.projectSize || "",
          possessionStatus: overview.possessionStatus || "",
        },
        Parking,
        virtualTour: req.body.virtualTour
          ? JSON.parse(req.body.virtualTour)
          : [],
        bathroomInfo: JSON.parse(bathroomInfo),
        bedroomInfo: JSON.parse(bedroomInfo),
        roomInfo: JSON.parse(roomInfo),
        interiorFeatures: JSON.parse(interiorFeatures),
        exteriorFeatures: JSON.parse(exteriorFeatures),
        otherFeatures: JSON.parse(otherFeatures),
        Amenities: JSON.parse(Amenities),
        latitude,
        longitude,
        aboutDeveloper: JSON.parse(aboutDeveloper),
        localityOverview: JSON.parse(localityOverview),
        FaqData: JSON.parse(FaqData),
      });

      // Save the new property to the database
      const savedProperty = await newProperty.save();
      res.status(201).json(savedProperty);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          message: "Validation Error",
          details: error.errors,
        });
      } else if (error instanceof CastError) {
        return res.status(400).json({
          message: "Invalid data type encountered",
          details: error.message,
        });
      } else if (
        error instanceof SyntaxError &&
        error.message.includes("JSON")
      ) {
        return res.status(400).json({
          message: "JSON Syntax Error",
          details: error.message,
        });
      } else if (error.name === "MongoError" && error.code === 11000) {
        return res.status(409).json({
          message: "Duplicate Key Error",
          details: error.keyValue,
        });
      } else {
        console.error("Unexpected Error:", error);
        return res.status(500).json({
          message: "Internal Server Error",
          details: error.message,
        });
      }
    }
  },
];

// Helper function to parse nested structures
const parseNestedStructure = (data) => {
  const cleanString = (str) => {
    return str.replace(/[\r\n\t]/g, "").trim();
  };

  // Parse arrays
  if (data.sidePics) data.sidePics = cleanString(data.sidePics).split(",");
  if (data.bathroomInfo)
    data.bathroomInfo = cleanString(data.bathroomInfo).split(",");
  if (data.bedroomInfo)
    data.bedroomInfo = cleanString(data.bedroomInfo).split(",");
  if (data.Amenities) {
    data.Amenities = cleanString(data.Amenities)
      .split(",")
      .map((item) => Number(item.trim()));
  }
  if (data.virtualTour)
    data.virtualTour = cleanString(data.virtualTour).split(",");
  if (data.addRoomInfo)
    data.addRoomInfo = cleanString(data.addRoomInfo).split(",");
  if (data.interiorFeatures)
    data.interiorFeatures = cleanString(data.interiorFeatures).split(",");

  // Parse JSON structures
  if (data.roomInfo) data.roomInfo = JSON.parse(cleanString(data.roomInfo));
  if (data.aboutDeveloper)
    data.aboutDeveloper = JSON.parse(cleanString(data.aboutDeveloper));
  if (data.localityOverview)
    data.localityOverview = JSON.parse(cleanString(data.localityOverview));
  if (data.overview) data.overview = JSON.parse(cleanString(data.overview));
  if (data.FaqData) {
    // Handle potential JSON parsing errors in FaqData
    try {
      data.FaqData = JSON.parse(cleanString(data.FaqData));
    } catch (error) {
      console.error(`Error parsing FaqData: ${error.message}`);
      data.FaqData = []; // Handle gracefully if parsing fails
    }
  }

  return data;
};

// Get all properties with optional filtering by status and type
exports.getAllProperties = async (req, res) => {
  try {
    const { Status, PropertyType } = req.query;
    const filter = {};

    if (Status) {
      filter.Status = Status;
    }

    if (PropertyType) {
      filter.PropertyType = PropertyType;
    }

    // Logging the filter to verify what's being passed
    console.log("Filter:", filter);

    // Query the database using the filter
    const properties = await NewProperty.find(filter);

    // Returning the properties as JSON response
    res.status(200).json(properties);
  } catch (error) {
    // Handling any errors and returning an error response
    console.error("Error fetching properties:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching properties", error: error.message });
  }
};

// Get a property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await NewProperty.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a property by ID
exports.updatePropertyById = async (req, res) => {
  try {
    const updatedProperty = await NewProperty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProperty)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a property by ID
exports.deletePropertyById = async (req, res) => {
  try {
    const deletedProperty = await NewProperty.findByIdAndDelete(req.params.id);
    if (!deletedProperty)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload and parse Excel file
exports.uploadExcelFile = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Process each row to handle nested structures
    const processedData = jsonData.map(parseNestedStructure);

    // Insert data into the database
    await NewProperty.insertMany(processedData);

    res
      .status(201)
      .json({ message: "File uploaded and data inserted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete all properties
exports.deleteAllProperties = async (req, res) => {
  try {
    await NewProperty.deleteMany({});
    res.status(200).json({ message: "All properties deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
