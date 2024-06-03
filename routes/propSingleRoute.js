const express = require('express');
const router = express.Router();
const propSingleController = require('../controller/PropSingleController');
const upload = require('../middlewares/upload');

// Create a new project
router.post('/', propSingleController.createProject);

// Get all projects
router.get('/', propSingleController.getAllProjects);

// Get a single project by ID
router.get('/:id', propSingleController.getProjectById);

// Update a project by ID
router.put('/:id', propSingleController.updateProject);

// Delete a project by ID
router.delete('/:id', propSingleController.deleteProject);

// Upload Excel file
router.post('/upload', upload.single('file'), propSingleController.uploadExcel);

module.exports = router;
