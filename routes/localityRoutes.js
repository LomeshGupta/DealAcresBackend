const express = require("express");
const router = express.Router();
const localityController = require("../controller/localityController");
const authMiddleware = require("../Middleware/authMiddleware");
const { upload } = require("../utils/fileUpload");

router.use(authMiddleware);

// Create a new locality
router.post("/", upload.array("image"), localityController.createLocality);

// Get all localities
router.get("/", localityController.getAllLocalities);

// Get a locality by ID
router.get("/:id", localityController.getLocalityById);

// Update a locality by ID
router.patch("/:id", localityController.updateLocalityById);

// Delete a locality by ID
router.delete("/:id", localityController.deleteLocalityById);

module.exports = router;
