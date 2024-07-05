
const Recipy = require('../models/recipy'); // Assurez-vous que le chemin est correct

exports.addRecipy = (req, res, next) => {
    const newRecipy = new Recipy(req.body);
    newRecipy.save()
        .then(() => res.json('Backend message : recette ajoutée avec succès'))
        .catch(err => res.status(400).json('Erreur: ' + err));
}

exports.getRecipesByEmail = (req, res, next) => {
    const userEmail = req.params.email;
    Recipy.find({ user_email: userEmail })
        .then(recipies => {
            if (!recipies) {
                return res.status(404).json("Aucune recette trouvée pour cet utilisateur");
            }
            res.json(recipies);
        })
        .catch(err => res.status(500).json('Erreur: ' + err));
}

exports.getRecipeByName = (req, res, next) => {
     const name = req.params.name;
     Recipy.findOne({ name }) // { name } est équivalent à { name: name }
        .then(recipy => {
            if (!recipy) {
                return res.status(404).json('Aucune recette trouvée avec ce nom');
            }
            res.json(recipy);
        })
        .catch(err => res.status(500).json('Erreur: ' + err));
}

exports.deleteRecipy = (req, res, next) => {
    Recipy.findByIdAndDelete(req.params.id)
        .then(() => res.json('Recette supprimée'))
        .catch(err => res.status(400).json('Erreur: ' + err));
}