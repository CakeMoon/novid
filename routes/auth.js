const express = require('express');

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

        // must find user in the DB
        if (!user) {
            res.status(404).json({
                error: `Could not find user ${req.body.username}`
            }).end();
            return;
        }

        // authenticate and sign the user in
        if (user.username !== req.body.username || user.password !== req.body.password) {
            res.status(401).json({
                error: `Your username and password are incorrect.`
            }).end();
            return;
        }

        req.session.uid = user.uid;
        res.status(201).json({
            data: user,
            message: "You are signed in."
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