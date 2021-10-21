const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require('./auth.config');
const Users = require('../models/Users');
const middleware = require('./middleware');

const router = express.Router();

/**
 * Signs in a user
 * @name POST/api/users/auth/signin
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {User} - Signed in user
 * @throws {404} - if username does not exist
 * @throws {401} - if username and password are incorrect
 * @throws {503} - if user could not be signed in
 */
router.post('/signin',
    [
        middleware.ensureUserNotSignedIn,
        middleware.ensureValidPasswordInBody,
        middleware.ensureValidUsernameInBody
    ],
    async (req, res) => {
        try {
            const user = await Users.findUser(req.body.username);

            // must find user in the DB
            if (!user) {
                res.status(404).json({
                    message: `Could not find user ${req.body.username}`,
                    accessToken: null,
                }).end();
                return;
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            // authenticate and sign the user in
            if (!passwordIsValid) {
                res.status(401).json({
                    message: `Your username and password are incorrect.`,
                    accessToken: null,
                }).end();
                return;
            }

            const token = jwt.sign({ id: user.uid }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            delete user.password;

            console.log(user);

            res.status(201).json({
                data: user,
                message: "You are signed in.",
                accessToken: token,
            }).end();

        } catch (error) {
            res.status(503).json({
                message: "Could not sign user in",
                accessToken: null,
            }).end();
        }
    }
);

/**
 * Add a new user (Sign up a new user)
 * @name POST/api/users/auth/signup
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {User} - Signed up user
 * @throws {400} - If the username already exists.
 */
router.post('/signup',
    [
        middleware.ensureUserNotSignedIn,
        middleware.ensureValidPasswordInBody,
        middleware.ensureValidUsernameInBody,
    ],
    async (req, res) => {
        try {
            const username = req.body.username;
            const password = bcrypt.hashSync(req.body.password, 8);

            let user = await Users.addUser(username, password);
            delete user.password;
            res.status(201).json({
                user,
                message: "Please sign in to continue."
            }).end();
        } catch (error) {
            res.status(400).json({
                message: "The username already exists. Please enter a different username."
            }).end();
        }
    }
);

module.exports = router;