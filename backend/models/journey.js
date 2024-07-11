const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RecipeSchema = require('./recipe').schema;


const MealSchema
    = new Schema({
    date : {
        type: Date,
        required: true
    },
    meal_type : {
        type: String,
        required: true
    },
    recipie: RecipeSchema,
})

const JourneySchema = new Schema({
    user_email : {
        type: String,
        required: true
    },
    journey_name: {
        type: String,
        required: true,
        unique: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    meals: [MealSchema],
});

module.exports = mongoose.model('Journey', JourneySchema);