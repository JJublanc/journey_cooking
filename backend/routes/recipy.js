const express = require('express');
const router = express.Router();

const recipyCtrl = require('../controllers/recipy');

router.post('/recipy_add', recipyCtrl.addRecipy);
router.delete('/recipy_delete/:id', recipyCtrl.deleteRecipy);

module.exports = router;