var mongoose = require('mongoose');
var Journey = require('../models/journey'); // assuming the model for 'journeys' is called 'Journey'
require('dotenv').config();
const connectionString = process.env.MONGODB_URI;
console.log(connectionString);

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Successfully connected to MongoDB'))
    .catch((e) => console.error('Failed to connect to MongoDB', e));

module.exports.up = function (next) {
    Journey.collection.dropIndex('meals.recipe.recipe_name_1', function (err) {
        if (err) {
            console.log('Error in dropping index!', err);
        }
        next();
    });
};

module.exports.down = function (next) {
    Journey.collection.createIndex({'meals.recipe.recipe_name': 1}, {unique: true}, function (err) {
        if (err) {
            console.log('Error in creating index!', err);
        }
        next();
    });
};