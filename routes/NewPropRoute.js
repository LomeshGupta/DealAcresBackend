const express = require("express");
const propertyController = require("../controller/NewPropController");
const multer = require("multer");
const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });
const router = express.Router();

router.post("/", propertyController.createProperty);
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);
router.put("/:id", propertyController.updatePropertyById);
router.delete("/:id", propertyController.deletePropertyById);
router.post(
  "/upload",
  uploads.single("file"),
  propertyController.uploadExcelFile
);
router.delete("/", propertyController.deleteAllProperties);

module.exports = router;
