// Ioana A Mititean
// Exercise 34.2 - Express Bookstore

/** Express app for bookstore. */


const express = require("express");
const { ExpressError } = require("./expressError");

const app = express();

app.use(express.json());

// Routes
const {router: bookRoutes} = require("./routes/books");
app.use("/books", bookRoutes);


/** 404 handler */
app.use(function (req, res, next) {
    const err = new ExpressError("Not Found", 404);
    return next(err);
});


/** General error handler */
app.use(function(err, req, res, next) {
    res.status(err.status || 500);

    return res.json({
        error: err,
    });
});


module.exports = { app };
