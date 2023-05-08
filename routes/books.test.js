// Ioana A Mititean
// Exercise 34.2 - Express Bookstore

/** Tests for book routes. */

process.env.NODE_ENV = "test";

const request = require("supertest");

const { app } = require("../app");
const { db } = require("../db");


let testBook1;
let testBook2;

beforeEach(async () => {
    const result = await db.query(`
        INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year)
        VALUES
            (
                '0000000001',
                'http://testurl1.com',
                'Test Author 01',
                'Test Language 01',
                100,
                'Test Publisher 01',
                'Test Title 01',
                2000
            ),
            (
                '0000000002',
                'http://testurl2.com',
                'Test Author 02',
                'Test Language 02',
                200,
                'Test Publisher 02',
                'Test Title 02',
                4000
            )
        RETURNING isbn, amazon_url, author, language, pages, publisher, title, year`);

    testBook1 = result.rows[0];
    testBook2 = result.rows[1];
})

afterEach(async () => {
    await db.query(`DELETE FROM books`);
})

afterAll(async () => {
    await db.end();
})

describe("GET /books", () => {
    test("Gets a list of 2 books", async () => {
        const resp = await request(app).get("/books");

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            books: [testBook1, testBook2]
        });
    })
})

describe("GET /books/:isbn", () => {
    test("Gets a single book", async () => {
        const resp = await request(app).get(`/books/${testBook1.isbn}`);

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            book: testBook1
        });
    })

    test("Returns status code of 404 if book not found", async () => {
        const badIsbn = "9999999999";
        const resp = await request(app).get(`/books/${badIsbn}`);

        expect(resp.statusCode).toEqual(404);
        expect(resp.body).toEqual({
            error: {
                message: `There is no book with an isbn '${badIsbn}'`,
                status: 404
            }
        });
    })
})

describe("POST /books", () => {

    const oneInvalidField = {
        isbn: '0000000003',
        amazon_url: 'NOT A VALID URL',
        author: 'Test Author 03',
        language: 'Test Language 03',
        pages: 300,
        publisher: 'Test Publisher 03',
        title: 'Test Title 03',
        year: 2003
    };

    const fiveInvalidFields = {
        isbn: 0,
        amazon_url: 'NOT A VALID URL',
        author: 'Test Author 03',
        language: 'Test Language 03',
        pages: '300',
        publisher: 'Test Publisher 03',
        title: 3.141592,
        year: 2183
    };

    const reqFieldsMissing = {
        amazon_url: 'http://testurl3.com',
        author: 'Test Author 03',
        pages: 300,
        year: 2003
    };

    const validNewBook = {
        isbn: '0000000003',
        amazon_url: 'http://testurl3.com',
        author: 'Test Author 03',
        language: 'Test Language 03',
        pages: 300,
        publisher: 'Test Publisher 03',
        title: 'Test Title 03',
        year: 2003
    };

    test("Adds a valid new book", async () => {
        const postResp = await request(app)
            .post("/books")
            .send(validNewBook);

        expect(postResp.statusCode).toEqual(201);
        expect(postResp.body).toEqual({
            book: validNewBook
        });

        // Check that the new book was indeed added
        const getResp = await request(app).get(`/books/${validNewBook.isbn}`);
        expect(getResp.statusCode).toEqual(200);
        expect(getResp.body).toEqual({
            book: validNewBook
        });
    })

    test("Returns correct response for invalid new book: 1 invalid data field", async () => {
        const postResp = await request(app)
            .post("/books")
            .send(oneInvalidField);

        expect(postResp.statusCode).toEqual(400);
        expect(postResp.body).toHaveProperty("error");
        expect(postResp.body.error.message).toHaveLength(1);

        // Check that the new book was not added
        const getResp = await request(app).get(`/books/${oneInvalidField.isbn}`);
        expect(getResp.statusCode).toEqual(404);
    })

    // test("Returns correct response for invalid new book: multiple invalid data fields",
    // async () => {

    // })

    // test("Returns correct response for invalid new book: missing required fields", async () => {

    // })
})

describe("PUT /books/:isbn", () => {
    const validUpdatedData = {
        amazon_url: "http://updatedurl.com",
        author: "Updated Author",
        language: "Updated Language",
        pages: 1000,
        publisher: "Updated Publisher",
        title: "Updated Title",
        year: 1900
    }

    test("Correctly updates an existing book with valid new data", async () => {
        const resp = await request(app)
            .put(`/books/${testBook1.isbn}`)
            .send(validUpdatedData);

        const updatedBook = {...validUpdatedData};
        updatedBook.isbn = testBook1.isbn;

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            book: updatedBook
        });
    })

    test("Returns status code of 404 if book not found", async () => {
        const badIsbn = "9999999999";
        const resp = await request(app)
            .put(`/books/${badIsbn}`)
            .send(validUpdatedData);

        expect(resp.statusCode).toEqual(404);
        expect(resp.body).toEqual({
            error: {
                message: `There is no book with an isbn '${badIsbn}'`,
                status: 404
            }
        });
    })
})

describe("DELETE /books/:isbn", () => {
    test("Deletes an existing book", async () => {
        const delResp = await request(app).delete(`/books/${testBook1.isbn}`);

        expect(delResp.statusCode).toEqual(200);
        expect(delResp.body).toEqual({
            message: "Book deleted"
        });

        // Check that the book was indeed deleted
        const getResp = await request(app).get(`/books/${testBook1.isbn}`);
        expect(getResp.statusCode).toEqual(404);
    })

    test("Returns status code of 404 if book not found", async () => {
        const badIsbn = "9999999999";
        const resp = await request(app).delete(`/books/${badIsbn}`);

        expect(resp.statusCode).toEqual(404);
        expect(resp.body).toEqual({
            error: {
                message: `There is no book with an isbn '${badIsbn}'`,
                status: 404
            }
        });
    })
})