const express = require("express");
const {
  getService,
  addService,
  updateService,
  deleteService,
} = require("../controller/serviceController");
const router = express.Router();

router.get("/getservices", getService);
router.post("/addservice", addService);
router.post("/updateservice", updateService);
router.post("/deleteservice", deleteService);

module.exports = router;
