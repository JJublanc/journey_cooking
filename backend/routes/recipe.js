const express = require('express');
const router = express.Router();

const recipyCtrl = require('../controllers/recipe');

router.post('/recipy_add', recipyCtrl.addRecipe);
router.get('/recipes/:email', recipyCtrl.getRecipesByEmail);
router.get('/recipe/:name', recipyCtrl.getRecipeByName);
router.delete('/recipy_delete/:id', recipyCtrl.deleteRecipe);

module.exports = router;