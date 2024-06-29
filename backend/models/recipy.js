const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipyIngredientSchema = new Schema({
    ingredient_name: {
        type: String,
        required: true
    },
    recipy_ingredient_unit: {
        type: String,
        required: true
    },
    recipy_ingredient_quantity: {
        type: Number,
        required: true
    },
});

const RecipySchema = new Schema({
    user_email: {
        type: String,
        required: true
    },
    name: {
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
        required: true
    },
    max_person_number: {
        type: Number,
        required: true
    },
    season: {
        type: String,
        required: true
    },
    meal: {
        type: String,
        required: true
    },
    recipy_ingredients: [RecipyIngredientSchema],
});

module.exports = mongoose.model('Recipy', RecipySchema);