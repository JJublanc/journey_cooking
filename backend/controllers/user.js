const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();


exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({message: 'Paire login/mot de passe incorrecte'});
                    }
                    res.status(200).json({
                        user: {
                            email: user.email,
                            name: user.name,
                            token: jwt.sign(
                                {userId: user._id},
                                process.env.RANDOM_TOKEN_SECRET,
                                {expiresIn: '24h'}
                            )
                        }
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.signup = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
                if (user) {
                    return res.status(400).json({message: 'Email already in use!'});
                }

                bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        const user = new User({
                            email: req.body.email,
                            name: req.body.name,
                            password: hash
                        });
                        user.save()
                            .then((savedUser) => res.status(201).json({
                                    message: 'User created!',
                                    user: {
                                        email: savedUser.email,
                                        name: savedUser.name,
                                        token: jwt.sign(
                                            {userId: savedUser._id},
                                            process.env.RANDOM_TOKEN_SECRET,
                                            {expiresIn: '24h'}
                                        )
                                    },
                                })
                            )
                            .catch(error => res.status(400).json({error}));
                    })
                    .catch(error => res.status(500).json({error}));
            }
        )
        .catch(error => res.status(500).json({error}));
}

exports.getUserProfile = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
        const userId = decodedToken.userId;

        User.findById(userId)
            .then(user => {
                if (!user) {
                    return res.status(404).json({message: 'User not found'});
                }
                res.status(200).json({
                    user: {
                        email: user.email,
                        name: user.name,
                        token: jwt.sign(
                                    {userId: userId},
                                    process.env.RANDOM_TOKEN_SECRET,
                                    {expiresIn: '24h'})
                    }
                });
            })
            .catch(error => res.status(500).json({error}));
    } catch {
        res.status(401).json({message: 'Invalid request!'});
    }
};