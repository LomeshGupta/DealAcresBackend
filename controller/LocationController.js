// controllers/locationController.js
const Location = require('../models/LocationModel');

exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const locationId = req.params.id;
    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createLocation = async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const locationId = req.params.id;
    const updatedLocation = await Location.findByIdAndUpdate(locationId, req.body, { new: true });
    if (!updatedLocation) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.status(200).json(updatedLocation);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const locationId = req.params.id;
    const deletedLocation = await Location.findByIdAndDelete(locationId);
    if (!deletedLocation) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
