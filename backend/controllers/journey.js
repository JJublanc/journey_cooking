const Journey = require('../models/journey'); // Assurez-vous que le chemin est correct

exports.addJourney = (req, res, next) => {
    const newJourney = new Journey(req.body);

    newJourney.save()
        .then(() => res.json('Journey ajouté avec succès'))
        .catch(err => res.status(400).json('Erreur: ' + err));
}

exports.deleteJourney = (req, res, next) => {
    Journey.findByIdAndDelete(req.params.id)
        .then(() => res.json('Journey supprimé'))
        .catch(err => res.status(400).json('Erreur: ' + err));
}