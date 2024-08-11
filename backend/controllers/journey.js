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

exports.listUserJourneys = (req, res, next) => {
    const userEmail = req.params.user_email;

    Journey.find({ user_email: userEmail })
        .then(journeys => {
            if(!journeys){
                return res.status(404).json('Aucun voyages trouvés pour cet utilisateur');
            }
            res.json(journeys);
        })
        .catch(err => res.status(500).json('Erreur: ' + err));
};

exports.getJourneyIngredients = (req, res, next) => {
    const userId = req.params.user_email;
    const journeyId = req.params.journey_id;
    Journey.findOne({user_email: userId, _id: journeyId})
        .then(journey => {
            if (!journey) {
                return res.status(404).json('Aucun voyage trouvé avec ce nom ' + journeyId + ' pour cet utilisateur');
            }
            let ingredients = [];
            journey.meals.forEach(meal => {
                meal.recipe.recipe_ingredients.forEach(ingredient => {
                    ingredients.push(ingredient);
                });
            });
            let groupedIngredients = ingredients.reduce((acc, ingredient) => {
                let key = ingredient.ingredient_name + "-" + ingredient.recipy_ingredient_unit;
                if (!acc[key]) {
                    acc[key] = {
                        ingredient_name: ingredient.ingredient_name,
                        recipe_ingredient_unit: ingredient.recipe_ingredient_unit,
                        recipe_ingredient_quantity: 0
                    };
                }
                acc[key].recipe_ingredient_quantity += ingredient.recipe_ingredient_quantity;
                return acc;
            }, {});
            res.json(Object.values(groupedIngredients));
        })
        .catch(err => res.status(500).json('Erreur: ' + err));
};