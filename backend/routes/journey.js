const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const journeyCtrl = require('../controllers/journey');

router.get('/journey_ingredients/:user_email/:journey_id', auth,  journeyCtrl.getJourneyIngredients);
router.get('/user_journeys/:user_email', auth, journeyCtrl.listUserJourneys);
router.post('/journey_add', auth, journeyCtrl.addJourney);
router.delete('/journey_delete/:id', auth, journeyCtrl.deleteJourney);

module.exports = router;