const express = require('express');
const v = require('./validators');
const assert = require('assert');

const Businesses = require('../models/Businesses');
const Reviews = require('../models/Reviews');

const router = express.Router();

const filterBusiness = (business) => {
    delete business['vcode'];
    delete business['authcode'];
};

const filterBusinesses = (businesses) => {
    businesses.forEach(business => filterBusiness(business));
};

/**
 * List all businesses.
 * 
 * @name GET /api/businesses
 * @return {Business[]} - list of businesses
 */
router.get('/', [], async (req, res) => {
    try {
        console.log(req);
        const allBusinesses = await Businesses.getAllBusinesses();
        filterBusinesses(allBusinesses);
        res.status(200).json(allBusinesses).end();
    } catch (error) {
        res.status(503).json({ error: `Could not fetch all businesses: ${error}` }).end();
    }
});

/**
 * List all business owners (uid) of the given business.
 * 
 * @name GET /api/businesses/:businessId/owner
 * @param {number} businessId - id of business
 * @return {Owner[]} - list of owners
 * @throws {404} - If the business does not exist
 */
router.get('/:businessId/owner', [], async (req, res) => {
    let bid = req.params.businessId;
    let business = await Businesses.getOneBusiness(bid);
    if (business == null) {
        res.status(404).json({
            error: `The business does not exist.`,
        }).end();
        return;
    }
    let businessOwners = await Businesses.getBusinessOwners(bid);
    res.status(200).json(businessOwners).end();
});

/**
 * Add the logged in user to the business (with authcode).
 * 
 * @name POST /api/businesses/:businessId/owner
 * @param {string} authcode - Authentication code
 * @returns {string} - Successfully claimed message
 * @throws {404} - If the business does not exist
 * @throws {400} - If authcode is wrong or the user already owned the business
 */
router.post('/:businessId/owner', [v.ensureUserSignedIn], async (req, res) => {
    let uid = req.session.uid;
    let bid = req.params.businessId;
    let business = await Businesses.getOneBusiness(bid);
    if (business == null) {
        res.status(404).json({
            error: `The business does not exist.`,
        }).end();
        return;
    }
    if (business.authcode != req.body.authcode) {
        res.status(400).json({
            error: `Incorrect authcode.`,
        }).end();
        return;
    }
    let currentOwners = await Businesses.getBusinessOwners(bid);
    if (currentOwners.filter(obj => obj.uid === uid).length > 0) {
        res.status(400).json({
            error: `You already owned the business.`,
        }).end();
        return;
    }
    Businesses.addBusinessOwner(bid, uid);
    res.status(200).send(`Successfully claimed the business.`).end();
});

/**
 * List all reviews of the given business.
 * 
 * @name GET /api/businesses/:businessId/reviews
 * @param {number} businessId - id of the business
 * @returns {Review[]} - List of reviews
 * @throws {404} - If the business does not exist
 */
router.get('/:businessId/reviews', [], async (req, res) => {
    let bid = req.params.businessId;
    let business = await Businesses.getOneBusiness(bid);
    if (business == null) {
        res.status(404).json({
            error: `The business does not exist.`,
        }).end();
        return;
    }
    try {
        const allReviews = await Reviews.getAllReviews(bid);
        res.status(200).json(allReviews).end();
    } catch (error) {
        res.status(503).json({ error: `Could not fetch all reviews: ${error}` }).end();
    }
});

/**
 * Get calculated review scores for the given business.
 * 
 * @name GET /api/businesses/:businessId/reviews/scores
 * @param {number} businessId - id of the business
 * @returns {Rating} - prompts and prompt-wise ratings
 * @throws {404} - If the business does not exist
 */
router.get('/:businessId/reviews/scores', [], async (req, res) => {
    let bid = req.params.businessId;
    let business = await Businesses.getOneBusiness(bid);
    if (business == null) {
        res.status(404).json({
            error: `The business does not exist.`,
        }).end();
        return;
    }
    try {
        const ratingBreakdown = await Reviews.getRatingBreakdown(bid);
        res.status(200).json(ratingBreakdown).end();
    } catch (error) {
        res.status(503).json({ error: `Could not fetch the scores: ${error}` }).end();
    }
});

/**
 * Submit a review.
 * 
 * @name POST /api/businesses/:businessId/reviews
 * @param {string} vcode
 * @param {string | undefined} reviewText
 * @param {Array.<{promptID: number, response: number}>} ratings 
 * @returns {string} - Successfully reviewed message
 * @throws {404} - If the business does not exist
 */
router.post('/:businessId/reviews', [v.ensureUserSignedIn], async (req, res) => {
    let uid = req.session.uid;
    let bid = req.params.businessId;
    let business = await Businesses.getOneBusiness(bid);
    if (business == null) {
        res.status(404).json({
            error: `The business does not exist.`,
        }).end();
        return;
    }
    let verified = (req.body.vcode == business.vcode);
    let reviewDate = new Date();
    let date = reviewDate.getDate();
    let month = reviewDate.getMonth() + 1; // getMonth returns months from 0-11
    let year = reviewDate.getFullYear();
    let dateStr = month + "/" + date + "/" + year;
    // check if the user has posted the review today
    let reviewsPostedToday = await Reviews.getReviewsByDate(bid, uid, dateStr);
    if (reviewsPostedToday.length > 0) {
        res.status(400).json({ error: `You may not post more than one review per business per day.`}).end();
        return;
    }
    // proceed to record the review
    try {
        req.body.ratings.forEach(rating => assert(rating.promptID >= 0 && parseInt(rating.response) >= 1 && parseInt(rating.response) <= 5));
        Reviews.submitReview(bid, uid, req.body.reviewText, req.body.ratings, verified, dateStr);
        res.status(200).send(`Your review has been processed.`).end();
    } catch {
        res.status(400).json({ error: `The submitted review is malformed.` }).end();
    }
});

/**
 * Verify a vcode.
 * 
 * @name POST /api/businesses/:businessId/vcode
 * @param {string} vcode
 * @returns {string} - Successfully verified message
 * @throws {404} - If the business does not exist
 * @throws {400} - If the vcode is wrong
 */
router.post('/:businessId/vcode', [v.ensureUserSignedIn], async (req, res) => {
    const bid = req.params.businessId;
    const business = await Businesses.getOneBusiness(bid);
    if (business == null) {
        res.status(404).json({
            error: `The business does not exist.`,
        }).end();
        return;
    }
    const verified = (req.body.vcode == business.vcode);
    if (verified) {
        res.status(200).send(`You are verified!`).end();
    } else {
        res.status(400).json({ error: `Wrong vcode` }).end();
    }
});

/**
 * List all businesses which have the name matching the search
 * 
 * @name GET /api/businesses/search/?name=
 * @param {string} name - name of businesses to search
 * @returns {Business[]} - found businesses
 * @throws {400} - If the name is empty
 * @throws {404} - If the business does not exist
 */
router.get('/search/', [], async (req, res) => {
    const businessName = req.query.name;
    if (businessName.length === 0) {
    res.status(400).json({ error: "You must specify a non empty business name" }).end();
    return;
    }
    const businesses = await Businesses.getBusinessesByName(businessName);
    if (businesses.length === 0) {
        res.status(404).json({ error: "Business you search doesn't exist" }).end();
        return;
    }
    filterBusinesses(businesses);
    res.status(200).json(businesses).end();
});

/**
 * Get information of one business.
 * 
 * @name GET /api/businesses/:businessId
 * @param {number} bid - id of the business
 * @returns {Business} - found business
 * @throws {404} - If the business does not exist
 * @throws {400} - If the bid is empty
 */
router.get('/:bid?', [], async (req, res) => {
    const businessId = req.params.bid;
    if (businessId.length === 0) {
        res.status(400).json({ error: "You must specify a non empty business id" }).end();
        return;
    }
    let business = await Businesses.getOneBusiness(businessId);
    if (!business) {
        res.status(404).json({ error: "Business doesn't exist" }).end();
        return;
    }
    if (req.session.uid) {
        // field `owned`
        const businessOwners = (await Businesses.getBusinessOwners(businessId)).map(entry => entry.uid);
        business.owned = businessOwners.includes(req.session.uid);

        // field `eligibleToReview`
        let reviewDate = new Date();
        let date = reviewDate.getDate();
        let month = reviewDate.getMonth() + 1; // getMonth returns months from 0-11
        let year = reviewDate.getFullYear();
        let dateStr = month + "/" + date + "/" + year;
        const reviewsPostedToday = (await Reviews.getReviewsByDate(businessId, req.session.uid, dateStr));
        business.eligibleToReview = reviewsPostedToday.length === 0;
    }
    filterBusiness(business);
    res.status(200).json(business).end();
});

/**
 * Update business details
 * 
 * @name PATCH /api/businesses/:businessId
 * @param {number} bid - id of the business
 * @param {number} delivery - 1 if this business provides delivery, 0 if not
 * @param {number} takeout - 1 if this business provides takeout, 0 if not
 * @param {number} outdoor - 1 if customers can dine outdoor, 0 if not
 * @param {number} indoor - 1 if customers can dine indoor, 0 if not
 * @param {number} vcode - the verification code for reviewing this business
 * @returns {Business} - updated business
 * @throws {404} - If the business does not exist
 * @throws {403} - If the logged in user does not own the business
 */
router.patch('/:bid', [v.ensureUserSignedIn], async (req, res) => {
    const uid = req.session.uid;
    const bid = req.params.bid;
    const business = await Businesses.getOneBusiness(bid);
    if (business == null) {
        res.status(404).json({
            error: `The business does not exist.`,
        }).end();
        return;
    }
    let businessOwners = (await Businesses.getBusinessOwners(bid)).map(entry => entry.uid);
    if (!businessOwners.includes(uid)) {
        res.status(403).json({
            error: `You do not own the business.`,
        }).end();
        return;
    }
    if (req.body.vcode != null) business.vcode = parseInt(req.body.vcode);
    if (req.body.delivery != null) business.delivery = req.body.delivery;
    if (req.body.takeout != null) business.takeout = req.body.takeout;
    if (req.body.outdoor != null) business.outdoor = req.body.outdoor;
    if (req.body.indoor != null) business.indoor = req.body.indoor;
    await Businesses.modifyBusiness(bid, business);
    filterBusiness(business);
    res.status(200).json(business).end();
});

module.exports = router;