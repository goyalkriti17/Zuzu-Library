var express = require('express');
var bcrypt = require('bcrypt');
var jsonwebtoken = require('jsonwebtoken');
var CONFIG = require('../config');
var TOKEN_SECRET = CONFIG.token.secret;
var TOKEN_EXPIRES = parseInt(CONFIG.token.expiresInSeconds, 10);

var User = require('../models/user');

var router = express.Router();

router.post('/', function createUser(request, response) {

    console.log(request.body);


    // find the user
    User.findOne({
        email: request.body.email
    }, function handleQuery(error, user) {

        if (error) {
            response.status(500).json({
                success: false,
                message: 'Internal server error'
            });

            return;
        }

        if (user) {
            response.status(409).json({
                success: false,
                message: 'User with the email \'' + request.body.email + '\' already exists.'
            });

            return;
        }

        bcrypt.genSalt(10, function (error, salt) {

            if (error) {
                response.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });

                throw error;
            }

            bcrypt.hash(request.body.password, salt, function (error, hash) {

                if (error) {
                    response.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });

                    throw error;
                }

                var user = new User({
                    email: request.body.email,
                    password: hash,
                    firstName: request.body.firstName,
                    lastName: request.body.lastName,
                    role: request.body.role
                });

                user.save(function (error) {

                    if (error) {
                        response.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });

                        throw error;
                    }

                    response.json({
                        success: true,
                        user: user
                    });
                });
            });
        });
    });
});

router.post('/authenticate', function authenticateUser(request, response) {

    // find the user
    User.findOne({
        email: request.body.email
    }, function handleQuery(error, user) {

        if (error) {
            response.status(500).json({
                success: false,
                message: 'Internal server error'
            });

            throw error;
        }

        if (! user) {

            response.status(401).json({
                success: false,
                message: 'Authentication failed. User not found.'
            });

            return;
        }

        bcrypt.compare(request.body.password, user.password, function (error, result) {

            if (error) {
                response.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });

                throw error;
            }

            if (! result) {

                response.status(401).json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });

                return;
            }

            // if user is found and password is right
            // create a token
            var token = jsonwebtoken.sign({ email: user.email }, TOKEN_SECRET, {
                expiresIn: TOKEN_EXPIRES
            });

            // return the information including token as JSON
            response.json({
                success: true,
                token: token
            });

        });
    });
});

module.exports = router;