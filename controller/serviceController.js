const asyncHandler = require("express-async-handler");
const Service = require("../models/serviceModel");
const XLSX = require("xlsx");
const cloudinary = require("cloudinary").v2;
const { fileSizeFormatter } = require("../utils/fileUpload");

cloudinary.config({
  cloud_name: "dmen2qi7t",
  api_key: "426686656792964",
  api_secret: "xTxrl7ezipvf-fuWZ-Gm33wDvL0",
});

// Get all services
const getService = asyncHandler(async (req, res) => {
  const services = await Service.find();
  res.status(200).json(services);
});

// Get single service
const getSingleService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (service) {
    res.status(200).json(service);
  } else {
    res.status(404).json({ message: "Service not found" });
  }
});

// Add new service
const addService = asyncHandler(async (req, res) => {
  const { name, type, experts, content, faq } = req.body;

  // Validations
  if (!name) {
    res.status(400);
    throw new Error("Please enter all required fields.");
  }

  let heroImgUrl = "";

  try {
    if (req.file) {
      const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "service_dealacres",
        public_id: `${Date.now()}-${req.file.originalname}`,
        resource_type: "image",
      });
      heroImgUrl = uploadedFile.secure_url;
    }

    // Create new service
    const service = await Service.create({
      name,
      type,
      HeroImg: heroImgUrl,
      experts: JSON.parse(experts),
      content: JSON.parse(content),
      faq: JSON.parse(faq),
    });

    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image could not be uploaded" });
  }
});

// Update service
const updateService = asyncHandler(async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(404);
    throw new Error("Service not found");
  }
});

// Delete service
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (service) {
    res.status(200).json({ message: "Service deleted successfully" });
  } else {
    res.status(404).json({ message: "Service not found" });
  }
});

// Delete all services
const deleteAllServices = asyncHandler(async (req, res) => {
  try {
    await Service.deleteMany({});
    res.status(200).json({ message: "All services deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting services" });
  }
});

// Upload services data from an Excel file
const excelUpload = asyncHandler(async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    const services = data.map((item) => ({
      name: item.name,
      type: item.type,
      homepageshow: item.homepageshow,
      icon: item.icon,
      tagline: item.tagline,
      HeroImg: item.HeroImg,
      experts: JSON.parse(item.Experts),
      content: JSON.parse(item.content),
      faq: JSON.parse(item.FaqData),
      logo: item.logo,
    }));

    await Service.insertMany(services);
    res.status(201).json({ message: "Services uploaded successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  getService,
  addService,
  updateService,
  deleteService,
  deleteAllServices,
  getSingleService,
  excelUpload,
};
