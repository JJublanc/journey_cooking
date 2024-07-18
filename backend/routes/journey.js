const express = require('express');
const router = express.Router();

const journeyCtrl = require('../controllers/journey');

router.post('/journey_add', journeyCtrl.addJourney);
router.delete('/journey_delete/:id', journeyCtrl.deleteJourney);

module.exports = router;