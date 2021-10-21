const express = require('express');

const Favorites = require('../models/Favorites');
const Reviews = require('../models/Reviews');
const v = require('./validators');
const middleware = require('./middleware');

const router = express.Router();

const filterBusiness = (business) => {
    delete business['vcode'];
    delete business['authcode'];
};

const filterBusinesses = (businesses) => {
    businesses.forEach(business => filterBusiness(business));
};

/**
 * Get all the favorites of a user
 * @name GET/api/users/favorites
 * @param {number} uid - id of user 
 * @return {Favorite[]} - list of all favorited businesses by user
 * @throws {503} - if any error with getting all favorited businesses by user
 */
router.get('/favorites',
    [middleware.ensureUserSignedIn],
    async (req, res) => {
        try {
            const uid = req.uid;

            // make sql query to get all favorites by user
            favorites = await Favorites.findAllFavorites(uid);

            // if (favorites.length == 0) {
            //     res.status(200).json({
            //         data: favorites,
            //         message: 'You have not favorited any businesses yet'
            //     }).end();
            //     return;
            // }

            res.status(200).json(favorites).end();

        } catch (error) {
            res.status(503).json({error: `Could not get all favorites: ${error}`}).end();
        }
});

/**
 * List all favorite businesses which have the name matching the search
 * 
 * @name GET /api/users/favorites/search/?name=
 * @param {string} name - name of businesses to search
 * @returns {Business[]} - found businesses
 * @throws {400} - If the name is empty
 * @throws {404} - If the business does not exist
 */
 router.get('/favorites/search/', 
    [middleware.ensureUserSignedIn], 
    async (req, res) => {
    const uid = req.uid;
    const businessName = req.query.name;
    if (businessName.length === 0) {
        res.status(400).json({ error: "You must specify a non empty business name" }).end();
        return;
    }
    const businesses = await Favorites.getFavoritesByName(uid, businessName);
    filterBusinesses(businesses);
    res.status(200).json(businesses).end();
});

/**
 * Get a specific favorite
 * @name GET/api/users/favorites/:bid
 * @param {number} uid - id of user
 * @param {number} businessId - id of the business to find from the user's favorites
 * @return {boolean} favorite - true if business found in user's favorites, false otherwise
 * @throws {503} - if any error finding the business in the user's favorites
 */
router.get('/favorites/:businessId',
    [middleware.ensureUserSignedIn],
    async (req, res) => {
    try {
        const uid = req.uid;
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
    [middleware.ensureUserSignedIn],
    async (req, res) => {
    try {
        const uid = req.uid;
        console.log(uid);
        const bid = req.params.businessId; 

        let business = await Favorites.findFavorite(uid, bid);
        if (business) {
            res.status(409).json({
                error: `Business with ID ${bid} already exists in the user's favorites`
            }).end();
            return;
        }

        // make sql query to add favorite
        console.log(uid);
        business = await Favorites.addFavorite(uid, bid);
        filterBusiness(business)
        console.log(business);
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
    [middleware.ensureUserSignedIn],
    async (req, res) => {
        try {
            const uid = req.uid;
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
        let promptScores = await Reviews.getUserReviewScores(rid);
        res.status(200).json(promptScores).end();
    } catch (error) {
        res.status(503).json({
            error: "Was not able to get the review's numeric scores"
        }).end();
    }
});


module.exports = router;
