const express = require("express");
const {
  getService,
  addService,
  updateService,
  deleteService,
  getSingleService,
  deleteAllServices,
  excelUpload,
} = require("../controller/serviceController");

const router = express.Router();
const { upload } = require("../utils/fileUpload");
// const authMiddleware = require("../Middleware/authMiddleware");

// router.use(authMiddleware);

router.get("/", getService);
router.get("/:id", getSingleService);
router.post("/", upload.single("HeroImg"), addService);
router.put("/:id", upload.single("HeroImg"), updateService);
router.delete("/:id", deleteService);
router.delete("/", deleteAllServices);
router.post("/upload", upload.single("file"), excelUpload);

module.exports = router;
