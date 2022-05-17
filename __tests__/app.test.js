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

describe('GET /api/', () => {
    describe('GET /api/topics', () => {
        test('200: responds with an array of topic objects, each with properties: slug and description', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body : { topics } }) => {
                expect(topics).toHaveLength(3)
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
                expect(message).toBe('invalid endpoint')
            })
        })
    });
    
    describe('GET /api/articles/:article_id', () => {
        test('200: responds with an article object, each with properties: sauthor which is the username from the users table, title, article_id, body, topic, created_at, votes', () => {
            return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then(({ body : { article } }) => {
                expect(article).toEqual({
                    article_id: 3,
                    title: "Eight pug gifs that remind me of mitch",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "some gifs",
                    created_at: "2020-11-03T09:12:00.000Z",
                    votes: 0,
                  })
            })
        });

        test('400: bad request, responds with invalid article id ', () => {
            return request(app)
            .get('/api/articles/uehh')
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('invalid request')
            })
        });
    
        test('404: not found, article id not found', () => {
            return request(app)
            .get('/api/articles/1995')
            .expect(404)
            .then(({ body: { message } }) => {
                expect(message).toBe('id not found')
            })
        })

    });
});
