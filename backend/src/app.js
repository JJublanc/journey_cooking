const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('../routes/user');
const recipyRoutes = require('../routes/recipe');
const journeyRoutes = require('../routes/journey');
require('dotenv').config();
app.use(express.json());
const url = require('url');

//TODO : remove proxy usage
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');

var allowedOrigins = ['http://localhost:3000'];

// Utiliser cors comme middleware à l'échelle de l'application
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
// Utiliser sanitize pour prévenir l'injection NoSQL

app.use(mongoSanitize());

// Tentative de connexion
mongoose.connect("process.env.MONGODB_URI", options)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((reason) => console.log('Connexion à MongoDB échouée !', reason));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);
app.use('/api/recipe', recipyRoutes);
app.use('/api/journey', journeyRoutes);

module.exports = app;