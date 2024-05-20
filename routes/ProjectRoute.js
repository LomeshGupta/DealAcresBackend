const express = require('express');
const router = express.Router();
const projectController = require('../controller/ProjectController');

// Project routes
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
