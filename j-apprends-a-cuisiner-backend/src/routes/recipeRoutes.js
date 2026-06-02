const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { protect, adminOnly } = require('../middleware/auth');

// Routes publiques
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);
router.get('/region/:regionId', recipeController.getRecipesByRegion);

// Routes protégées (nécessitent authentification + admin)
router.post('/', protect, adminOnly, recipeController.createRecipe);
router.put('/:id', protect, adminOnly, recipeController.updateRecipe);
router.delete('/:id', protect, adminOnly, recipeController.deleteRecipe);

module.exports = router;
