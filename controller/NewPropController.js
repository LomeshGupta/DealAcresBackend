const express = require("express");
const router = express.Router();
const xlsx = require("xlsx");
const NewProperty = require("../models/newPropertyModel");

// Helper function to parse nested structures
const parseNestedStructure = (data) => {
  // Parse arrays
  if (data.sidePics) data.sidePics = data.sidePics.split(",");
  if (data.bathroomInfo) data.bathroomInfo = data.bathroomInfo.split(",");
  if (data.bedroomInfo) data.bedroomInfo = data.bedroomInfo.split(",");
  if (data.Amenities) {
    data.Amenities = data.Amenities.split(",").map((item) =>
      Number(item.trim())
    );
  }

  // Parse JSON structures
  if (data.roomInfo) data.roomInfo = JSON.parse(data.roomInfo);
  if (data.FaqData) data.FaqData = JSON.parse(data.FaqData);

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

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await NewProperty.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
