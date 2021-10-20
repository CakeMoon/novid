const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Users = require('../models/Users');
const Favorites = require('../models/Favorites');
const Reviews = require('../models/Reviews');
const v = require('./validators');
const middleware = require('./middleware');

const router = express.Router();

/**
 * Get all the favorites of a user
 * @name GET/api/users/favorites
 * @param {number} uid - id of user 
 * @return {Favorite[]} - list of all favorited businesses by user
 * @throws {503} - if any error with getting all favorited businesses by user
 */
router.get('/favorites',
    [middleware.verifyToken],
    async (req, res) => {
        try {
            const uid = req.session.uid;

            // make sql query to get all favorites by user
            favorites = await Favorites.findAllFavorites(uid);

            if (favorites.length == 0) {
                res.status(200).json({
                    data: favorites,
                    message: 'You have not favorited any businesses yet'
                }).end();
                return;
            }

            res.status(200).json(favorites).end();

        } catch (error) {
            res.status(503).json({error: `Could not get all favorites: ${error}`}).end();
        }
});

/**
 * Add a new user (Sign up a new user)
 * @name POST/api/users
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {User} - Signed up user
 * @throws {400} - If the username already exists.
 */
router.post('/', 
    [
        v.ensureValidPasswordInBody,
        v.ensureValidUsernameInBody,
        v.ensureUserNotSignedIn
    ],
    async (req, res) => {
    try {
        const username = req.body.username;
        const password = bcrypt.hashSync(req.body.password, 8);

        let user = await Users.addUser(username, password);
        res.status(201).json({
            user,
            message: "Please sign in to continue."
        }).end();
    } catch (error) {
        res.status(400).json({
            error: "The username already exists. Please enter a different username."
        }).end();
    }
    }
);

/**
 * Get a specific favorite
 * @name GET/api/users/favorites/:bid
 * @param {number} uid - id of user
 * @param {number} businessId - id of the business to find from the user's favorites
 * @return {boolean} favorite - true if business found in user's favorites, false otherwise
 * @throws {503} - if any error finding the business in the user's favorites
 */
router.get('/favorites/:businessId',
    [v.ensureUserSignedIn],
    async (req, res) => {
    try {
        const uid = req.session.uid;
        const bid = req.params.businessId;

        let business = await Favorites.findFavorite(uid, bid);
        const favorite = !(business === undefined);
        res.status(200).json(favorite).end();
    } catch (error) {
        res.status(503).json({
            error: "Was not able to find the favorite successfully."
        }).end();
    }
});


/**
 * Add a favorite
 * @name POST/api/users/favorites/:bid
 * @param {number} businessId - id of the business to favorite
 * @param {number} uid - id of user favoriting the business
 * @return {Favorite} - bid of business favorited and uid of user who favorited the business
 * @throws {409} - if the business has already been favorited by the user
 * @throws {503} - if any error with adding the business to the user's favorites
 */

router.post('/favorites/:businessId',
    [v.ensureUserSignedIn],
    async (req, res) => {
    try {
        const uid = req.session.uid;
        const bid = req.params.businessId; 

        let business = await Favorites.findFavorite(uid, bid);
        if (business) {
            res.status(409).json({
                error: `Business with ID ${bid} already exists in the user's favorites`
            }).end();
            return;
        }

        // make sql query to add favorite
        business = await Favorites.addFavorite(uid, bid);
        res.status(201).json(business).end();

    } catch (error) {
        res.status(503).json({error: `Could not add to favorite: ${error}`}).end();
    }
});


/** Delete a favorite 
 * @name DELETE/api/users/favorites/:bid
 * @param {number} businessId - id of the business to un-favorite
 * @param {number} uid - id of user un-favoriting the business
 * @return {Favorite} - bid of business un-favorited and uid of 
 *                      user who un-favorited the business
 * @throws {404} - if business to un-favorite does not exist in the user's favorites
 * @throws {503} - if any error with removing the business from the user's favorites
*/

router.delete('/favorites/:businessId',
    [v.ensureUserSignedIn],
    async (req, res) => {
        try {
            const uid = req.session.uid;
            const bid = req.params.businessId;

            let business = await Favorites.findFavorite(uid, bid);

            if (!business) {
            res.status(404).json({
                error: `Business with ID ${bid} does not exist in the user's favorites`
            }).end();
            return;
            }

            // make sql query to remove favorite
            business = await Favorites.deleteFavorite(uid, bid);
            res.status(200).json(business).end();

        } catch (error) {
            res.status(503).json({error: `Could not remove from favorite: ${error}`}).end();
        }
});

/** Get numeric scores of a review 
 * @name DELETE/api/users/:reviewID/scores
 * @param {number} reviewId - id of review 
 * @return {PromptScore[]} - promptwise scores of the review
 * @throws {503} - if any error with retrieving the prompt-wise scores of the review
*/
router.get('/:reviewId/scores',
    async (req, res) => {
    try {
        const rid = req.params.reviewId;
        console.log(rid);
        let promptScores = await Reviews.getUserReviewScores(rid);
        res.status(200).json(promptScores).end();
    } catch (error) {
        res.status(503).json({
            error: "Was not able to get the review's numeric scores"
        }).end();
    }
});


module.exports = router;
