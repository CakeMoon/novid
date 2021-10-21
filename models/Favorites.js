const db = require('../db/db_config');
const Businesses = require('./Businesses');

class Favorites {

    /**
     * Find a business in user's favorites
     * @param {number} uid - User ID of logged in user
     * @param {number} bid - business ID to find in favorites table
     * @return {Favorite | undefined} - found favorite
     */
    static async findFavorite(uid, bid) {
        return db.get(`SELECT * FROM favorites WHERE ${db.columnNames.userID} = ${uid} AND
         ${db.columnNames.businessID} = ${bid}`);
    }

    /**
     * Add a business to user's favorites
     * @param {number} uid - User ID of logged in user
     * @param {number} bid - BID of business to add 
     * @return {Favorite} - added favorite 
     */
    static async addFavorite(uid, bid) {
        console.log("?");
        return db.run(`INSERT INTO favorites(uid, bid) VALUES (${uid}, ${bid})`)
                .then(() => {
                    return Businesses.getOneBusiness(bid); 
                });
    }

    /**
     * Remove a business from user's favorites
     * @param {number} uid - User ID of logged in user
     * @param {number} bid - BID of business to remove 
     * @return {Favorite} - removed favorite 
     */
    static async deleteFavorite(uid, bid) {
        return Favorites.findFavorite(uid, bid)
            .then((business) => {
                db.run(`DELETE FROM favorites WHERE ${db.columnNames.userID} = ${uid} AND
                ${db.columnNames.businessID} = ${bid}`);
                return business;
            });
    }

    /**
     * Get all businesses in user's favorites
     * @param {number} uid - User ID of logged in user
     * @return {Businesses[]} - return user's favorited businesses' bid, name, overall rating, and number of reviews
     */
    static async findAllFavorites(uid) {
        return db.all(`SELECT *
                        FROM businesses
                        WHERE ${db.columnNames.businessID} IN (
                            SELECT ${db.columnNames.businessID}
                            FROM favorites
                            WHERE ${db.columnNames.userID} = ${uid}
                        )`);
    }

    /**
     * Find all favorited Businesses having the same name.
     * 
     * @param {string} name - name of Businesses to find
     * @return {Business[]} - found Businesses
     */
         static async getFavoritesByName(uid, name) {
            const pattern = "%" + name + "%";
            return db.all(`SELECT *
                            FROM businesses
                            WHERE ${db.columnNames.businessID} IN (
                                SELECT ${db.columnNames.businessID}
                                FROM favorites
                                WHERE ${db.columnNames.userID} = ${uid}
                            ) AND ${db.columnNames.businessName} LIKE ?`, [pattern]);
        }

}

module.exports = Favorites;