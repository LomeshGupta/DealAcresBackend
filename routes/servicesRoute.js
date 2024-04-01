const express = require("express");
const {
  getService,
  addService,
  updateService,
  deleteService,
  getSingleService,
} = require("../controller/serviceController");

const router = express.Router();
const { upload } = require("../utils/fileUpload");

router.get("/", getService);
router.get("/:id",getSingleService);
router.post("/", upload.array("image"), addService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

module.exports = router;