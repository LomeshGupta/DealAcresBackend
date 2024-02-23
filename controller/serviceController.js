const asyncHandler = require("express-async-handler");
const Service = require("../models/serviceModel");
const { json } = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//get all users----------------------------------------------

const getService = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  const services = await Service.find();
  res.status(200).json(services);
});

//delete one service------------------------------------------
const deleteService = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    res.status(400);
    throw new Error("Please enter all required fields.");
  }
  const service = await Service.deleteOne({ _id });
  res.status(200);
  res.send("deleted successfully");
});

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

  //create new service

  const service = await Service.create({
    name,
    description,
    path,
  });

  if (service) {
    const { _id, name, description, path } = service;
    res.status(201).json({
      _id,
      name,
      path,
    });
  } else {
    res.status(400);
    throw new Error("Invalid service data");
  }
});

// Update service
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.body._id);

  if (user) {
    const { name, description, path } = user;
    user.name = req.body.name || name;
    user.description = req.body.description || description;
    user.path = req.body.path || path;

    const updatedService = await service.save();
    res.status(200).json({
      _id: updatedService._id,
      name: updatedService.name,
      description: updatedService.description,
      path: updatedService.path,
    });
  } else {
    res.status(404);
    throw new Error("Service not found");
  }
});

module.exports = {
  getService,
  addService,
  updateService,
  deleteService,
};
