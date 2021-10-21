const db = require('../db/db_config');

/**
 * @typeof Business
 * 
 * @prop {number} bid - the unique id of this business
 * @prop {string} name - the name of this business
 * @prop {string} address - the address of this business
 * @prop {number} delivery - 1 if this business provides delivery, 0 if not
 * @prop {number} takeout - 1 if this business provides takeout, 0 if not
 * @prop {number} outdoor - 1 if customers can dine outdoor, 0 if not
 * @prop {number} indoor - 1 if customers can dine indoor, 0 if not
 * @prop {number} vcode - the verification code for reviewing this business
 * @prop {number} authcode - the authentication code for claiming this business
 * @prop {number} rating - the overall rating of this business
 * @prop {number} numReviews - the total number of reviews made for this business
 */

/**
 * @class Businesses
 * 
 * Stores, reads and modifies data of all Businesses in database.
 */
class Businesses {
    /**
     * Return an array of all of the Businesses.
     * 
     * @return {Business[]}
     */
    static async getAllBusinesses() {
        return db.all(`SELECT * FROM businesses`);
    }

    /**
     * Find all Businesses having the same name.
     * 
     * @param {string} name - name of Businesses to find
     * @return {Business[]} - found Businesses
     */
    static async getBusinessesByName(name) {
        const pattern = "%" + name + "%";
        return db.all(`SELECT * FROM businesses WHERE ${db.columnNames.businessName} LIKE ?`, [pattern]);
    }

    /**
     * Find a Business by bid.
     * 
     * @param {number} bid - id of Business to find
     * @return {Business | undefined} - found Business
     */
    static async getOneBusiness(bid) {
        return db.get(`SELECT * FROM businesses WHERE ${db.columnNames.businessID} = '${bid}'`);
    }

    /**
     * Find all owners of a Business
     * 
     * @param {number} bid - id of Business to find
     * @return {BusinessOwner[]} - found BusinessOwners
     */
    static async getBusinessOwners(bid) {
        return db.all(`SELECT * FROM businessOwners WHERE ${db.columnNames.businessID} = '${bid}'`);
    }

    /**
     * Add a BusinessOwner to a Business
     * 
     * @param {number} bid - id of Business to add
     * @param {number} uid - id of User to add
     * @return {BusinessOwner} - created BusinessOwner
     */
    static async addBusinessOwner(bid, uid) {
        return db.run(`INSERT INTO businessOwners(bid, uid) VALUES (${bid}, ${uid})`);
    }

    /**
     * Find all BusinessOwners of a User
     * 
     * @param {number} uid - id of User to find
     * @return {BusinessOwner[]} - found BusinessOwners
     */
    static async getOwnedBusinesses(uid) {
        return db.all(`SELECT * FROM businessOwners WHERE ${db.columnNames.userID} = ${uid}`);
    }

    /**
     * Update a Business.
     * 
     * @param {number} bid - id of Business to update
     * @param {details} - new datails of the Business
     * @return {Business | undefined} - updated Business
     */
    static async modifyBusiness(bid, details) {
        return db.run(`UPDATE businesses 
                        SET vcode = ?, delivery = ?, takeout = ?, outdoor = ?, indoor = ?
                        WHERE ${db.columnNames.businessID} = ?`,
                        [details.vcode, details.delivery, details.takeout, details.outdoor, details.indoor, bid]);
    }
}

module.exports = Businesses;