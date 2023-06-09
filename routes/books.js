// Ioana A Mititean
// Exercise 34.2 - Express Bookstore

/** Routes for bookstore. */

const express = require("express");
const jsonschema = require("jsonschema");

const { Book } = require("../models/book");
const { ExpressError } = require("../expressError");
const newBookSchema = require("../schemas/newBookSchema.json");
const updateBookSchema = require("../schemas/updateBookSchema.json");

const router = new express.Router();


/** GET / => {books: [book, ...]}  */
router.get("/", async function (req, res, next) {
    try {
        const books = await Book.findAll(req.query);
        return res.json({ books });
    } catch (err) {
        return next(err);
    }
});


/** GET /[isbn]  => {book: book} */
router.get("/:isbn", async function (req, res, next) {
    try {
        const book = await Book.findOne(req.params.isbn);
        return res.json({ book });
    } catch (err) {
        return next(err);
    }
});


/** POST /  bookData => {book: newBook}  */
router.post("/", async function (req, res, next) {
    try {
        const validation = jsonschema.validate(req.body, newBookSchema);

        if (!validation.valid) {

            // Pass validation errors to error handler
            const errList = validation.errors.map((err) => {
                return err.stack;
            })

            throw new ExpressError(errList, 400);
        }

        const book = await Book.create(req.body);
        return res.status(201).json({ book });

    } catch (err) {
        return next(err);
    }
});


/** PUT /[isbn]   bookData => {book: updatedBook}  */
router.put("/:isbn", async function (req, res, next) {
    try {
        const validation = jsonschema.validate(req.body, updateBookSchema);

        if (!validation.valid) {

            // Pass validation errors to error handler
            const errList = validation.errors.map((err) => {
                return err.stack;
            })

            throw new ExpressError(errList, 400);
        }

        const book = await Book.update(req.params.isbn, req.body);
        return res.json({ book });

    } catch (err) {
        return next(err);
    }
});


/** DELETE /[isbn]   => {message: "Book deleted"} */
router.delete("/:isbn", async function (req, res, next) {
    try {
        await Book.remove(req.params.isbn);
        return res.json({ message: "Book deleted" });
    } catch (err) {
        return next(err);
    }
});

module.exports = { router };
