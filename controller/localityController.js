const Locality = require("../models/localityModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dmen2qi7t",
  api_key: "426686656792964",
  api_secret: "xTxrl7ezipvf-fuWZ-Gm33wDvL0",
});

// Controller functions
const createLocality = async (req, res) => {
  try {
    for (const file of req.files) {
      try {
        const uploadedFile = await cloudinary.uploader.upload(file.path, {
          folder: "locality_dealacres",
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
        // Handle Cloudinary upload error
        console.error("Cloudinary upload error:", uploadError);
        return res
          .status(500)
          .json({ message: "Error uploading file to Cloudinary." });
      }
    }
    const locality = new Locality(req.body);
    await locality.save();
    res.status(201).send(locality);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllLocalities = async (req, res) => {
  try {
    const localities = await Locality.find({});
    res.send(localities);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getLocalityById = async (req, res) => {
  try {
    const locality = await Locality.findById(req.params.id);
    if (!locality) {
      return res.status(404).send();
    }
    res.send(locality);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateLocalityById = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "state",
    "city",
    "zipCode",
    "population",
    "area",
    "landmarks",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const locality = await Locality.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!locality) {
      return res.status(404).send();
    }
    res.send(locality);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteLocalityById = async (req, res) => {
  try {
    const locality = await Locality.findByIdAndDelete(req.params.id);
    if (!locality) {
      return res.status(404).send();
    }
    res.send(locality);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createLocality,
  getAllLocalities,
  getLocalityById,
  updateLocalityById,
  deleteLocalityById,
};
