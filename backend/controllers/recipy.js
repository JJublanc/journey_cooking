
const Recipy = require('../models/recipy'); // Assurez-vous que le chemin est correct

exports.addRecipy = (req, res, next) => {
    const newRecipy = new Recipy(req.body);
    newRecipy.save()
        .then(() => res.json('Backend message : recette ajoutée avec succès'))
        .catch(err => res.status(400).json('Erreur: ' + err));
}

exports.deleteRecipy = (req, res, next) => {
    Recipy.findByIdAndDelete(req.params.id)
        .then(() => res.json('Recette supprimée'))
        .catch(err => res.status(400).json('Erreur: ' + err));
}