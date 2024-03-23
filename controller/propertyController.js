const Property = require("../models/propertyModel");
const multer = require("multer");
const xlsx = require("xlsx");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dmen2qi7t",
  api_key: "426686656792964",
  api_secret: "xTxrl7ezipvf-fuWZ-Gm33wDvL0",
});
// Create a new property
const createProperty = async (req, res) => {
  try {
    const newProperty = await Property.create(req.body);
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ error: "Error creating property" });
  }
};

// Get all properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving properties" });
  }
};

// Get a single property by ID
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (property) {
      res.status(200).json(property);
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving property" });
  }
};

// Update a property by ID
const updatePropertyById = async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedProperty) {
      res.status(200).json(updatedProperty);
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating property" });
  }
};

// Delete a property by ID
const deletePropertyById = async (req, res) => {
  try {
    const deletedProperty = await Property.findByIdAndRemove(req.params.id);
    if (deletedProperty) {
      res.status(200).json({ message: "Property deleted successfully" });
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting property" });
  }
};

//excel upload

const uploadPropertyData = async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    await Property.insertMany(data);
    res.send("File uploaded and data stored in database successfully!");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error saving data to database");
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updatePropertyById,
  deletePropertyById,
  uploadPropertyData,
};
