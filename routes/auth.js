const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require('./auth.config');
const Users = require('../models/Users');
const v = require('./validators');

const router = express.Router();

/**
 * Signs in a user and creates a session
 * @name POST/api/users/auth
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {User} - Signed in user
 * @throws {404} - if username does not exist
 * @throws {401} - if username and password are incorrect
 * @throws {503} - if user could not be signed in
 */
router.post('/',
    [
        v.ensureUserNotSignedIn,
        v.ensureValidPasswordInBody,
        v.ensureValidUsernameInBody
    ],
    async (req, res) => {   
    try {
        let user = await Users.findUser(req.body.username);

        console.log(user);
        // must find user in the DB
        if (!user) {
            res.status(404).json({
                error: `Could not find user ${req.body.username}`,
                accessToken: null,
            }).end();
            return;
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        console.log(passwordIsValid);
        // authenticate and sign the user in
        if (!passwordIsValid) {
            res.status(401).json({
                error: `Your username and password are incorrect.`
            }).end();
            return;
        }

        const token = jwt.sign({ id: user.uid }, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        console.log(token);

        res.status(201).json({
            data: user,
            message: "You are signed in.",
            accessToken: token,
        }).end();

    } catch (error) {
        res.status(503).json({
            error: "Could not sign user in"
        }).end();
    }
    }
);

/**
 * Signs out a user by deleting their authentication session
 * @name DELETE/api/users/auth
 * @throws {503} - if user could not be signed out
 */
router.delete('/',
    [
        v.ensureUserSignedIn
    ],
    async (req, res) => {
    try {
        // sign out user
        req.session.uid = undefined;
        res.status(200).json({
            message: "Successfully signed out."
        }).end();
    } catch (error) {
        res.status(503).json({
            error: "Could not sign user out."
        }).end();
    }
    }
);

module.exports = router;