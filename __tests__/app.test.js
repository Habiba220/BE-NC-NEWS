const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe('GET /api/topics', () => {
    test('200: responds with an array of topic objects, each with properties: slug and description', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body : { topics } }) => {
            expect((topics)).toHaveLength(3)
            topics.forEach((topic) => {
                expect(topic).toEqual(
                  expect.objectContaining({
                    description: expect.any(String),
                    slug: expect.any(String),
                  })
                );
              });
        })
    });
    test('404: endpoint not found', () => {
        return request(app)
        .get('/api/icbaedwidh')
        .expect(404)
        .then(({ body: { message } }) => {
            expect(message).toBe('Invalid endpoint')
        })
    })
});