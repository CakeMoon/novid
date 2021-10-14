const sqlite3 = require('sqlite3');

let sqlDb;

// name the columns of our tables for localization
const columnNames = {
    // businesses table
    businessID: "bid",
    businessName: "name",
    address: "address",
    delivery: "delivery",
    takeout: "takeout",
    outdoor: "outdoor",
    indoor: "indoor",
    vcode: "vcode",
    authcode: "authcode",
    rating: "rating",
    numReviews: "numReviews",

    // users table
    userID: "uid",
    username: "username",
    password: "password",

    // businessOwners table
    boID: "boID",

    // favorites table
    favID: "favID", 
    
    // reviews table
    reviewID: "reviewID", 
    reviewDate: "reviewDate",

    // reviewRating table
    ratingID: "ratingID", 
    prompt: "prompt",
    response: "response",
    verified: "verified",
    weight: "weight",

    // reviewText table
    textID: "textID", 
    text: "text",

    // prompts table
    promptID: "promptID",
    promptTitle: "promptTitle",
    promptDesc: "promptDesc",

    // promptRating table
    prID: "prID",
    promptRating: "promptRating"
};
Object.freeze(columnNames);


async function createDb() {
    console.log("created our db!");
    sqlDb = new sqlite3.Database('noviddb.db', async function() {
        await createPromptsTable();
        await createBusinessesTable();
        await createUsersTable();
        await createBusinessOwnerTable();
        await createFavoritesTable();
        await createReviewsTable();
        await createReviewRatingTable();
        await createReviewTextTable();
        await createPromptRatingsTable();
        await initializeBusinesses();
        initializePrompts();
    });
};

function createPromptsTable() {
  return run(`CREATE TABLE IF NOT EXISTS prompts (
      ${columnNames.promptID} INTEGER PRIMARY KEY AUTOINCREMENT,
      ${columnNames.promptTitle} TEXT NOT NULL UNIQUE,
      ${columnNames.promptDesc} TEXT NOT NULL
  )`);
};


// SHOULD THERE BE UNIQUE PROPERTY FOR authcode? Yes, fixed it!
function createBusinessesTable() {
    return run(`CREATE TABLE IF NOT EXISTS businesses (
        ${columnNames.businessID} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${columnNames.businessName} TEXT NOT NULL,
        ${columnNames.address} TEXT NOT NULL UNIQUE,
        ${columnNames.delivery} INTEGER,
        ${columnNames.takeout} INTEGER,
        ${columnNames.outdoor} INTEGER,
        ${columnNames.indoor} INTEGER,
        ${columnNames.vcode} INTEGER NOT NULL,
        ${columnNames.authcode} INTEGER NOT NULL UNIQUE,
        ${columnNames.rating} REAL,
        ${columnNames.numReviews} INTEGER DEFAULT 0
    )`);
};

function createUsersTable() {
    return run(`CREATE TABLE IF NOT EXISTS users (
        ${columnNames.userID} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${columnNames.username} TEXT NOT NULL UNIQUE,
        ${columnNames.password} TEXT NOT NULL
    )`);
};

function createBusinessOwnerTable() {
    return run(`CREATE TABLE IF NOT EXISTS businessOwners (
        ${columnNames.boID} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${columnNames.businessID} INTEGER,
        ${columnNames.userID} INTEGER,
        FOREIGN KEY(${columnNames.businessID})
        REFERENCES businesses(${columnNames.businessID}), 
        FOREIGN KEY(${columnNames.userID})
        REFERENCES users(${columnNames.userID})
    )`);
};

function createFavoritesTable() {
    return run(`CREATE TABLE IF NOT EXISTS favorites (
        ${columnNames.favID} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${columnNames.userID} INTEGER,
        ${columnNames.businessID} INTEGER,
        FOREIGN KEY(${columnNames.userID})
        REFERENCES users(${columnNames.userID}),
        FOREIGN KEY(${columnNames.businessID})
        REFERENCES businesses(${columnNames.businessID})
    )`);
};

// sqlite doesn't have datatype boolean
function createReviewsTable() {
    return run(`CREATE TABLE IF NOT EXISTS reviews (
        ${columnNames.reviewID} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${columnNames.businessID} INTEGER,
        ${columnNames.userID} INTEGER,
        ${columnNames.verified} INTEGER NOT NULL,
        ${columnNames.reviewDate} TEXT NOT NULL,
        FOREIGN KEY(${columnNames.businessID})
        REFERENCES businesses(${columnNames.businessID}),
        FOREIGN KEY(${columnNames.userID})
        REFERENCES users(${columnNames.userID})
    )`);
};

function createReviewRatingTable() {
    return run(`CREATE TABLE IF NOT EXISTS reviewRating (
        ${columnNames.ratingID} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${columnNames.reviewID} INTEGER NOT NULL,
        ${columnNames.promptID} INTEGER NOT NULL,
        ${columnNames.response} INTEGER NOT NULL,
        ${columnNames.weight} REAL NOT NULL,
        FOREIGN KEY(${columnNames.reviewID})
        REFERENCES reviews(${columnNames.reviewID}),
        FOREIGN KEY(${columnNames.promptID})
        REFERENCES prompts(${columnNames.promptID})
    )`);
};

function createReviewTextTable() {
    return run(`CREATE TABLE IF NOT EXISTS reviewText (
        ${columnNames.textID} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${columnNames.reviewID} INTEGER NOT NULL,
        ${columnNames.text} TEXT NOT NULL,
        FOREIGN KEY(${columnNames.reviewID})
        REFERENCES reviews(${columnNames.reviewID})
    )`);
};

function createPromptRatingsTable() {
    return run(`CREATE TABLE IF NOT EXISTS promptRating (
        ${columnNames.prID} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${columnNames.businessID} INTEGER NOT NULL,
        ${columnNames.promptID} INTEGER NOT NULL,
        ${columnNames.promptRating} REAL,
        FOREIGN KEY(${columnNames.businessID})
        REFERENCES businesses(${columnNames.businessID}),
        FOREIGN KEY(${columnNames.promptID})
        REFERENCES prompts(${columnNames.promptID})
    )`);
};


// Helper wrapper functions that return promises that resolve when sql queries are complete.

function run(sqlQuery, params) {
    return new Promise((resolve, reject) => {
      sqlDb.run(sqlQuery, params, (err) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve();
        }
      })
    });
};

function runWithLastIDCallback(sqlQuery, params, callback) {
  sqlDb.run(sqlQuery, params, function (err) {
    if (err) {
      console.log(err);
    } else {
      callback(this.lastID);
    }
  });
};
  
function get(sqlQuery, params) {
    return new Promise((resolve, reject) => {
      sqlDb.get(sqlQuery, params, (err, row) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(row);
        }
      })
    });
};
  
function all(sqlQuery, params) {
    return new Promise((resolve, reject) => {
      sqlDb.all(sqlQuery, params, (err, rows) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
    });
};


async function initializeBusinesses() {
    return sqlDb.run(`INSERT INTO businesses(name, address, delivery, takeout, outdoor, indoor, vcode, authcode, rating)
                VALUES
                ("ABC Pizza House", "744 Massachusetts Ave", 1, 1, 0, 0, 6162, 31775, null),
                ("Area Four", "500 Technology Square", 1, 1, 1, 1, 5344, 87900, null),
                ("Boston Burger Company", "1105 Massachusetts Ave", 1, 1, 1, 0, 7765, 90123, null),
                ("Bon Me", "201 Alewife Brooke Pkwy", 0, 1, 0, 0, 9091, 22876, null),
                ("Bon Me", "1 Kendall Square", 0, 1, 1, 0, 8883, 12877, null),
                ("Bon Me", "60 Binnery St", 1, 1, 1, 0, 1555, 24775, null),
                ("Charlie's Kitchen", "10 Eliot St", 0, 0, 1, 1, 4766, 74661, null),
                ("Dumpling House", "950 Massachusetts Ave", 1, 1, 0, 0, 3342, 10098, null),
                ("Falafel Corner", "8 Eliot St", 1, 1, 0, 0, 6544, 29864, null),
                ("IHOP", "16 Eliot St", 1, 1, 0, 1, 6078, 30992, null), 
                ("Le's", "36 JFK St", 1, 1, 0, 1, 3341, 11467, null),
                ("Nine Tastes", "50 JFK St", 1, 1, 0, 1, 3498, 22019, null),
                ("Pagu", "310 Massachusetts Ave", 1, 1, 1, 1, 8700, 35462, null),
                ("Tasty Burger", "40 JFK St", 1, 1, 0, 0, 1112, 12365, null),
                ("Tatte", "318 Third St", 0, 1, 1, 0, 6099, 47596, null),
                ("Tampopo", "1815 Massachusetts Ave", 1, 1, 0, 0, 7768, 46581, null);`,
                (err) => {
                  if (err) {
                    console.log("Warning: the businesses table might have been populated earlier.");
                  } else {
                    console.log("Populated businesses table successfully.");
                  }
                });
}

async function initializePrompts() {
  return sqlDb.run(`INSERT INTO prompts(promptTitle, promptDesc)
                    VALUES
                    ("Face Coverings", "Staff members have face coverings on at all times"),
                    ("Sanitation Supply", "Customers have access to hand sanitation supplies \
                                          (sink, soap, or hand sanitizer)"),
                    ("Social Distancing", "Sufficient physical distance is maintained between customers \
                                          and contact is minimized through delivery and takeout"),
                    ("Table Disinfection", "Tables are disinfected before and after customers dine");`,
                    (err) => {
                      if (err) {
                        console.log("Warning: the prompts table might have been populated earlier.");
                      } else {
                        console.log("Populated prompts table successfully.")
                      }
                    });
}


createDb();

module.exports = {
    columnNames,
    get,
    all,
    run,
    runWithLastIDCallback,
};



