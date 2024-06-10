const NewProperty = require("../models/newPropertyModel");
const cloudinary = require("cloudinary").v2;
const { fileSizeFormatter } = require("../utils/fileUpload");
const xlsx = require("xlsx");
const fs = require("fs");

cloudinary.config({
  cloud_name: "dmen2qi7t",
  api_key: "426686656792964",
  api_secret: "xTxrl7ezipvf-fuWZ-Gm33wDvL0",
});

exports.createProperty = async (req, res) => {
  try {
    // Check if files are present in the request
    if (!req.files || !req.files["mainPic"] || !req.files["sidePics"]) {
      res.status(400).json({ error: "No files uploaded" });
      return;
    }

    // Extract fields from req.body
    const {
      title,
      sideTitle,
      currentStatus,
      price,
      about,
      overview,
      specification,
      Amenities,
      mapCoordinates,
      aboutDeveloper,
      localityOverview,
      FaqData,
    } = req.body;

    // Upload mainPic to Cloudinary
    const mainPicFile = req.files["mainPic"][0];
    const uploadedMainPic = await cloudinary.uploader.upload(mainPicFile.path, {
      folder: "property_dealacres",
      public_id: `${Date.now()}-${mainPicFile.originalname}`,
      resource_type: "image",
    });
    const mainPic = {
      fileName: mainPicFile.originalname,
      filePath: uploadedMainPic.secure_url,
      fileId: `${Date.now()}-${mainPicFile.originalname}`,
      fileType: mainPicFile.mimetype,
      fileSize: fileSizeFormatter(mainPicFile.size, 2),
    };

    // Upload sidePics to Cloudinary
    const sidePics = await Promise.all(
      req.files["sidePics"].map(async (file) => {
        const uploadedFile = await cloudinary.uploader.upload(file.path, {
          folder: "property_dealacres",
          public_id: `${Date.now()}-${file.originalname}`,
          resource_type: "image",
        });
        return {
          fileName: file.originalname,
          filePath: uploadedFile.secure_url,
          fileId: `${Date.now()}-${file.originalname}`,
          fileType: file.mimetype,
          fileSize: fileSizeFormatter(file.size, 2),
        };
      })
    );

    // Upload imageCarousel to Cloudinary
    const imageCarousel = await Promise.all(
      req.files["imageCarousel"].map(async (file) => {
        const uploadedFile = await cloudinary.uploader.upload(file.path, {
          folder: "property_dealacres",
          public_id: `${Date.now()}-${file.originalname}`,
          resource_type: "image",
        });
        return {
          fileName: file.originalname,
          filePath: uploadedFile.secure_url,
          fileId: `${Date.now()}-${file.originalname}`,
          fileType: file.mimetype,
          fileSize: fileSizeFormatter(file.size, 2),
        };
      })
    );

    // Create new property
    const newProperty = await NewProperty.create({
      mainContent: {
        title,
        sideTitle,
        currentStatus,
        price,
        about,
        overview,
        specification,
        Amenities,
        mapCoordinates,
        aboutDeveloper,
        localityOverview,
        FaqData,
      },
      imageContainer: {
        mainPic: mainPic,
        sidePics: sidePics,
        imageCarousel: imageCarousel,
      },
    });

    res.status(201).json(newProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating property" });
  }
};

// Get all properties
exports.getProperties = async (req, res) => {
  try {
    const properties = await NewProperty.find();
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await NewProperty.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(updatedProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a property by ID
exports.deletePropertyById = async (req, res) => {
  try {
    const deletedProperty = await NewProperty.findByIdAndDelete(req.params.id);
    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Please upload an Excel file" });
    }

    // Read the Excel file from the buffer
    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const sheet_name_list = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    const properties = data.map((item) => ({
      imageContainer: {
        mainPic: item.mainPic,
        sidePics: item.sidePics ? item.sidePics.split(",") : [],
        imageCarasouel: item.imageCarasouel
          ? item.imageCarasouel.split(",")
          : [],
      },
      mainContent: {
        title: item.title,
        sideTitle: item.sideTitle,
        currentStatus: item.currentStatus,
        price: item.price,
        about: item.about,
        overview: {
          projectArea: item.projectArea,
          launchDate: item.launchDate,
          configuration: item.configuration,
          sizes: item.sizes,
          avgPrice: item.avgPrice,
          projectSize: item.projectSize,
          possessionStatus: item.possessionStatus,
        },
        specification: {
          Parking: {
            parkingInfo: item.parkingInfo ? item.parkingInfo.split(",") : [],
          },
          Interior: {
            virtualTour: item.virtualTour ? item.virtualTour.split(",") : [],
            bathroomInfo: item.bathroomInfo ? item.bathroomInfo.split(",") : [],
            bedroomInfo: item.bedroomInfo ? item.bedroomInfo.split(",") : [],
            roomInfo: item.roomInfo ? item.roomInfo.split(",") : [],
            addRoomInfo: item.addRoomInfo ? item.addRoomInfo.split(",") : [],
            interiorFeatures: item.interiorFeatures
              ? item.interiorFeatures.split(",")
              : [],
          },
        },
        Amenities: item.amenities ? item.amenities.split(",") : [],
        mapCoordinates: {
          latitude: item.latitude,
          longitude: item.longitude,
        },
        aboutDeveloper: {
          logoSrc: item.logoSrc,
          developerInfo: item.developerInfo,
        },
        localityOverview: {
          title: item.localityTitle,
          subtitle: item.localitySubtitle,
          introduction: item.localityIntroduction,
          Pros: item.localityPros ? item.localityPros.split(",") : [],
          Cons: item.localityCons ? item.localityCons.split(",") : [],
        },
        FaqData: item.FaqData ? item.FaqData.split(",") : [],
      },
    }));

    await NewProperty.insertMany(properties);

    res
      .status(201)
      .json({ message: "Properties uploaded successfully", properties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
