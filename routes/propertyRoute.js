const express = require("express");
const router = express.Router();
const propertyController = require("../controller/propertyController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/create", propertyController.createProperty);
router.get("/getall", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);
router.put("/:id", propertyController.updatePropertyById);
router.delete("/:id", propertyController.deletePropertyById);
router.post(
  "/uploadexcel",
  upload.single("excelFile"),
  propertyController.uploadPropertyData
);

module.exports = router;
