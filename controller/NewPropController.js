const express = require("express");
const router = express.Router();
const xlsx = require("xlsx");
const NewProperty = require("../models/newPropertyModel");

// Helper function to parse nested structures
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

// Create a new property
exports.createProperty = async (req, res) => {
  try {
    const newProperty = new NewProperty(req.body);
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
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
