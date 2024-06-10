const express = require("express");
const propertyController = require("../controller/NewPropController");
const multer = require("multer");
const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });
const router = express.Router();
const { upload } = require("../utils/fileUpload");

// const authMiddleware = require("../Middleware/authMiddleware");

// router.use(authMiddleware);

router.post(
  "/",
  upload.fields([{ name: "mainPic" }, { name: "sidePics" }], {
    name: "imageCarousel",
  }),
  propertyController.createProperty
);
router.get("/", propertyController.getProperties);
router.get("/:id", propertyController.getPropertyById);
router.put("/:id", propertyController.updatePropertyById);
router.delete("/:id", propertyController.deletePropertyById);
router.post(
  "/uploadexcel",
  uploads.single("excelFile"),
  propertyController.uploadExcel
);

module.exports = router;
