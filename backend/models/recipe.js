const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeIngredientSchema = new Schema({
    ingredient_name: {
        type: String,
        required: true
    },
    recipe_ingredient_unit: {
        type: String,
        required: true
    },
    recipe_ingredient_quantity: {
        type: Number,
        required: true
    },
});

const RecipeSchema = new Schema({
    user_email: {
        type: String,
        required: true
    },
    recipe_name: {
        type: String,
        required: true,
        unique: true
    },
    preparation_time: {
        type: Number,
        required: true
    },
    cooking_time: {
        type: Number,
        required: false
    },
    max_person_number: {
        type: Number,
        required: true
    },
    season: {
        type: String,
        required: true
    },
    recipe_ingredients: [RecipeIngredientSchema],
});

module.exports = mongoose.model('Recipy', RecipeSchema);