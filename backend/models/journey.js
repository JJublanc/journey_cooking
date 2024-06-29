const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RecipySchema = require('./recipy').schema;

const JourneySchema = new Schema({
    owner : {
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
    recipies: [RecipySchema],
});

module.exports = mongoose.model('Journey', JourneySchema);