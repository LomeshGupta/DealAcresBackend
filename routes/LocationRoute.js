// routes/locationRoutes.js
const express = require("express");
const router = express.Router();
const locationController = require("../controller/LocationController");
const { upload } = require("../utils/fileUpload");

router.get("/", upload.array("image"), locationController.getLocations);
router.get("/:id", locationController.getLocationById);
router.post("/", locationController.createLocation);
router.put("/:id", locationController.updateLocation);
router.delete("/:id", locationController.deleteLocation);

module.exports = router;
