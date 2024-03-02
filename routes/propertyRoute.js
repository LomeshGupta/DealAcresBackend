const express = require('express');
const router = express.Router();
const propertyController = require('../controller/propertyController');

router.post('/create', propertyController.createProperty);
router.get('/getall', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);
router.put('/:id', propertyController.updatePropertyById);
router.delete('/:id', propertyController.deletePropertyById);

module.exports = router;
