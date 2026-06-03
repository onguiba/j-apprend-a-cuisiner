const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController-sqlite');
const { protect, adminOnly } = require('../middleware/auth');

// Routes publiques
router.get('/', regionController.getAllRegions);
router.get('/:id', regionController.getRegionById);

// Routes protégées (nécessitent authentification + admin)
router.post('/', protect, adminOnly, regionController.createRegion);
router.put('/:id', protect, adminOnly, regionController.updateRegion);
router.delete('/:id', protect, adminOnly, regionController.deleteRegion);

module.exports = router;
