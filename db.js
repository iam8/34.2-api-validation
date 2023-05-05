// Ioana A Mititean
// Exercise 34.2 - Express Bookstore

/** Database config for bookstore. */


const { Client } = require("pg");
const { DB_URI } = require("./config");

let db = new Client({
    connectionString: DB_URI
});

db.connect();


module.exports = { db };
