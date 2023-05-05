// Ioana A Mititean
// Exercise 34.2 - Express Bookstore

/** Common config for bookstore. */


const HOSTNAME = "127.0.0.1";
const PORT = 3000;

let DB_URI = `postgresql://`;

if (process.env.NODE_ENV === "test") {
    DB_URI = `${DB_URI}/books_test`;
} else {
    DB_URI = process.env.DATABASE_URL || `${DB_URI}/books`;
}


module.exports = {
    HOSTNAME,
    PORT,
    DB_URI
};
