const express = require('express');
const router = express.Router();

const recipyCtrl = require('../controllers/recipy');

router.post('/recipy_add', recipyCtrl.addRecipy);
router.get('/recipes/:email', recipyCtrl.getRecipesByEmail);
router.get('/recipe/:name', recipyCtrl.getRecipeByName);
router.delete('/recipy_delete/:id', recipyCtrl.deleteRecipy);

module.exports = router;