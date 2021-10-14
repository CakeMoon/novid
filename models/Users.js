const db = require('../db/db_config.js');

/**
 * @class Users
 */
class Users {

    /**
     * Add a new User (equivalent to a user signing up)
     * 
     * @param {string} username - username
     * @param {string} password - password
     * @return {User} - created User
     */
    static async addUser(username, password) {
        return db.run(`
            INSERT INTO users (username, password) 
            VALUES ('${username}', '${password}')
        `)
            .then(() => {
                return Users.findUser(username);
            });
    }

    /**
     * Find a User given username
     * 
     * @param {string} username - username
     * @return {User | undefined} - found User
     */
    static async findUser(username) {
        return db.get(`
            SELECT *
            FROM users 
            WHERE username == '${username}'
        `);
    }
}

module.exports = Users;