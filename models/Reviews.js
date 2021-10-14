const app = require('../app');
const db = require('../db/db_config');

/**
 * @class Reviews
 */
class Reviews {
    static async getAllReviews(bid) {
        return db.all(`SELECT reviews.reviewID, reviews.verified, reviews.reviewDate, reviewText.text, username
                        FROM reviews INNER JOIN reviewText ON reviews.reviewID = reviewText.reviewID
                        INNER JOIN users ON reviews.uid = users.uid 
                        WHERE ${db.columnNames.businessID} = ${bid}
                        ORDER BY reviews.reviewID DESC`);
    }
    
    // I don't think we need this?
    static async getAllPrompts() {
        return db.all(`SELECT * FROM prompts`);
    }

    // return promptTitle and promptDesc along with the prompt-wise ratings
    static async getRatingBreakdown(bid) {
        return db.all(`SELECT   prompts.promptID,
                                promptTitle,
                                promptDesc,
                                promptRating.promptRating
                        FROM    prompts
                        LEFT JOIN (SELECT * FROM promptRating WHERE bid = ${bid}) AS promptRating
                        ON promptRating.promptID = prompts.promptID`);
    }

    static async recalculateRating(bid) {

        let submittedRatings = await db.all(`SELECT reviewRating.promptID, reviewRating.response, reviewRating.weight
                                            FROM reviews INNER JOIN reviewRating ON reviews.reviewID = reviewRating.reviewID
                                            WHERE reviews.bid = ${bid}`);
    
        // Calculate individual ratings
        let ratings = submittedRatings.reduce( (acc, rating) => {
            if (rating.promptID in acc) {
                acc[rating.promptID]["numerator"] += rating.weight * rating.response;
                acc[rating.promptID]["denominator"] += rating.weight;
            } else {
                acc[rating.promptID] = {};
                acc[rating.promptID]["numerator"] = rating.weight * rating.response;
                acc[rating.promptID]["denominator"] = rating.weight;
            }
            return acc;
        }, {});

        let individualScores = [];
        for (let promptID in ratings) {
            let score = ratings[promptID]["numerator"] / ratings[promptID]["denominator"];
            individualScores.push(score);
            let currentScore = await db.get(`SELECT * FROM promptRating WHERE bid = ${bid} AND promptID = ${promptID}`);
            if (currentScore == undefined) {
                db.run(`INSERT INTO promptRating(bid, promptID, promptRating)
                        VALUES (${bid}, ${promptID}, ${score})`);
            } else {
                db.run(`UPDATE promptRating SET promptRating = ${score} WHERE bid = ${bid} AND promptID = ${promptID}`);
            }
        }

        let overallScore = individualScores.reduce((a, b) => a+b)/individualScores.length;

        db.run(`UPDATE businesses SET rating = ${overallScore}, numReviews = numReviews + 1 WHERE bid = ${bid}`);

    }

    static async getReviewsByDate(bid, uid, date) {
        return db.all(`SELECT * FROM reviews WHERE bid = ${bid} AND uid = ${uid} AND reviewDate = "${date}"`);
    }

    static async submitReview(bid, uid, reviewText, ratings, verified, dateStr) {
        return db.runWithLastIDCallback(`INSERT INTO reviews(bid, uid, verified, reviewDate) 
                                        VALUES (${bid}, ${uid}, ${verified}, "${dateStr}")`,
            [],
            async function (reviewID) {
                if (reviewText != null && reviewText !== "") {
                    db.run(`INSERT INTO reviewText(reviewID, text) VALUES (${reviewID}, "${reviewText}")`);
                }
                let weight = verified ? 2 : 1;
                for (let rating of ratings) {
                    await db.run(`INSERT INTO reviewRating(reviewID, promptID, response, weight) 
                            VALUES (${reviewID}, ${rating.promptID}, ${parseInt(rating.response)}, ${weight})`);
                }
                Reviews.recalculateRating(bid);
            }
        );
    }

    static async getUserReviewScores(rid) {
        return db.all(`SELECT promptID, response FROM reviewRating
                        WHERE reviewID = ${rid}`);
    }
}

module.exports = Reviews;