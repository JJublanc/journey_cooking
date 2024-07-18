
const Recipe = require('../models/recipe'); // Assurez-vous que le chemin est correct

exports.addRecipe = (req, res, next) => {
    const newRecipy = new Recipe(req.body);
    newRecipy.save()
        .then(() => res.json('Backend message : recette ajoutée avec succès'))
        .catch(err => res.status(400).json('Erreur: ' + err));
}

exports.getRecipesByEmail = (req, res, next) => {
    const userEmail = req.params.email;
    Recipe.find({ user_email: userEmail })
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
     Recipe.findOne({ name }) // { name } est équivalent à { name: name }
        .then(recipy => {
            if (!recipy) {
                return res.status(404).json('Aucune recette trouvée avec ce nom');
            }
            res.json(recipy);
        })
        .catch(err => res.status(500).json('Erreur: ' + err));
}

exports.deleteRecipe = (req, res, next) => {
    Recipe.findByIdAndDelete(req.params.id)
        .then(() => res.json('Recette supprimée'))
        .catch(err => res.status(400).json('Erreur: ' + err));
}