const Locality = require("../models/Locality");
const XLSX = require("xlsx");

// Create a new locality
exports.createLocality = async (req, res) => {
  try {
    const locality = new Locality(req.body);
    const savedLocality = await locality.save();
    res.status(201).json(savedLocality);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all localities
exports.getAllLocalities = async (req, res) => {
  try {
    const localities = await Locality.find();
    res.status(200).json(localities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single locality by ID
exports.getLocalityById = async (req, res) => {
  try {
    const locality = await Locality.findById(req.params.id);
    if (!locality) {
      return res.status(404).json({ message: "Locality not found" });
    }
    res.status(200).json(locality);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a locality by ID
exports.updateLocality = async (req, res) => {
  try {
    const locality = await Locality.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!locality) {
      return res.status(404).json({ message: "Locality not found" });
    }
    res.status(200).json(locality);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a locality by ID
exports.deleteLocality = async (req, res) => {
  try {
    const locality = await Locality.findByIdAndDelete(req.params.id);
    if (!locality) {
      return res.status(404).json({ message: "Locality not found" });
    }
    res.status(200).json({ message: "Locality deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload localities via Excel file with memory storage
exports.uploadLocalities = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read the Excel file from memory buffer
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Map rows to the locality fields
    const localities = sheetData.map((row) => ({
      name: row["Name"],
      city: row["City"],
      state: row["State"],
      country: row["Country"],
      pincode: row["Pincode"],
      latitude: row["Latitude"],
      longitude: row["Longitude"],
      description: row["Description"],
      type: row["Type"],
      landmark: row["Landmark"],
      population_density: row["Population Density"],
      average_property_price: row["Average Property Price"],
      amenities: row["Amenities"],
    }));

    // Save all localities to the database
    const savedLocalities = await Locality.insertMany(localities);
    res.status(201).json({
      message: "Localities uploaded successfully",
      savedLocalities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
