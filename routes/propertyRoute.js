const express = require("express");
const propertyController = require("../controller/propertyController");
const multer = require("multer");
const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });
const router = express.Router();
const { upload } = require("../utils/fileUpload");

router.post(
  "/",
  upload.fields([{ name: "floorPlanImages" }, { name: "otherImages" }]),
  propertyController.createProperty
);
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);
router.put("/:id", propertyController.updatePropertyById);
router.delete("/:id", propertyController.deletePropertyById);
router.post(
  "/uploadexcel",
  uploads.single("excelFile"),
  propertyController.uploadPropertyData
);

module.exports = router;
