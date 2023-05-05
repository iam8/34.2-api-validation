// Ioana A Mititean
// Exercise 34.2 - Express Bookstore

/** Server startup for bookstore. */


const { app } = require("./app");
const { HOSTNAME, PORT } = require("./config");


app.listen(PORT, HOSTNAME, function () {
    console.log(`Listening on ${HOSTNAME}, port ${PORT}`);
});
