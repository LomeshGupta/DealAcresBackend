const express = require("express");
const router = express.Router();
const propertyController = require("../controller/propertyController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// const { upload } = require("../utils/fileUpload");

router.post(
  "/",
  upload.array("floorplanimage"),
  upload.array("otherimage"),
  propertyController.createProperty
);
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);
router.put("/:id", propertyController.updatePropertyById);
router.delete("/:id", propertyController.deletePropertyById);
router.post(
  "/uploadexcel",
  upload.single("excelFile"),
  propertyController.uploadPropertyData
);

module.exports = router;
