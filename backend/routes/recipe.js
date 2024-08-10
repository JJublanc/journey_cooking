const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const recipyCtrl = require('../controllers/recipe');

router.post('/recipy_add', auth, recipyCtrl.addRecipe);
router.get('/recipes/:email', auth, recipyCtrl.getRecipesByEmail);
router.get('/recipe/:recipe_name', auth, recipyCtrl.getRecipeByName);
router.delete('/recipy_delete/:id', auth, recipyCtrl.deleteRecipe);

module.exports = router;