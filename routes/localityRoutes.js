const express = require("express");
const router = express.Router();
const localityController = require("../controllers/localityController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), localityController.upload);

// Other routes
router.post("/", localityController.createLocality);
router.get("/", localityController.getAll);
router.get("/:id", localityController.getLocalityById);
router.put("/:id", localityController.updateLocality);
router.delete("/:id", localityController.deleteLocality);

module.exports = router;
