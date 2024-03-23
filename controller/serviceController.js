const asyncHandler = require("express-async-handler");
const Service = require("../models/serviceModel");
const { json } = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dmen2qi7t",
  api_key: "426686656792964",
  api_secret: "xTxrl7ezipvf-fuWZ-Gm33wDvL0",
});

//get all users----------------------------------------------

const getService = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  const services = await Service.find();
  res.status(200).json(services);
});

//delete one service------------------------------------------
const deleteService = async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  res.status(200);
  res.send("deleted successfully");
};

//register service ---------------------------------------------
const addService = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { name, description, path } = req.body;

  //validations
  if (!name || !description || !path) {
    res.status(400);
    throw new Error("Please enter all required fields.");
  }

  let fileData = [];

  try {
    for (const file of req.files) {
      const uploadedFile = await cloudinary.uploader.upload(file.path, {
        folder: "service_dealacres",
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

    //create new service

    const service = await Service.create({
      name,
      description,
      path,
      image_url: fileData,
    });

    if (service) {
      const { _id, name, path, image_url } = service;
      res.status(201).json({
        _id,
        name,
        path,
        image_url,
      });
    } else {
      res.status(400);
      throw new Error("Invalid service data");
    }
    // res.json({ imageUrl: url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image could not be uploaded" });
  }
});

// Update service
const updateService = asyncHandler(async (req, res) => {
  // const service = await Service.findById(req.body._id);

  try {
    // const { name, description, path, image_url } = service;
    // service.name = req.body.name || name;
    // service.description = req.body.description || description;
    // service.path = req.body.path || path;
    // service.image_url = req.body || image_url;

    // const updatedService = await service.save();

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      _id: updatedService._id,
      name: updatedService.name,
      description: updatedService.description,
      path: updatedService.path,
      image_url: updateService.image_url,
    });
  } catch (error) {
    res.status(404);
    throw new Error("Service not found");
  }
});

//get single

const getSingleService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      res.status(200).json(service);
    } else {
      res.status(404).json({ message: "Service not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving Service" });
  }
};

module.exports = {
  getService,
  addService,
  updateService,
  deleteService,
  getSingleService,
};
