const express = require('express');
const router = express.Router();

const journeyCtrl = require('../controllers/journey');

router.get('/journey_ingredients/:user_email/:journey_id', journeyCtrl.getJourneyIngredients);
router.get('/user_journeys/:user_email', journeyCtrl.listUserJourneys);
router.post('/journey_add', journeyCtrl.addJourney);
router.delete('/journey_delete/:id', journeyCtrl.deleteJourney);

module.exports = router;