const express = require('express');
const router = express.Router();
const regionController = require('../controllers/RegionController');

router.post('/regions', regionController.createRegion);
router.get('/regions', regionController.getAllRegions);
router.get('/regions/:id', regionController.getRegionById);
router.put('/regions/:id', regionController.updateRegionById);
router.delete('/regions/:id', regionController.deleteRegionById);


module.exports = router;
