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
                '0000000000',
                'http://testurl1.com',
                'Test Author 01',
                'Test Language 01',
                100,
                'Test Publisher 01',
                'Test Title 01',
                2000
            ),
            (
                '0000000001',
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