const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
require("jest-sorted");

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
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: 3,
                        title: "Eight pug gifs that remind me of mitch",
                        topic: "mitch",
                        author: "icellusedkars",
                        body: "some gifs",
                        created_at: "2020-11-03T09:12:00.000Z",
                        votes: 0,
                    })
                  );
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

        test('200: feature request now responds with article object with the added property comment_count', () => {
            return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then(({ body : { article } }) => {
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: 3,
                        title: "Eight pug gifs that remind me of mitch",
                        topic: "mitch",
                        author: "icellusedkars",
                        body: "some gifs",
                        created_at: "2020-11-03T09:12:00.000Z",
                        votes: 0,
                        comment_count: 2
                    })
                  );
            })
          });

    });

    describe('GET /api/articles', () => {
        test('200: responds with an articles array of article objects, each of which should have the following properties: author, title, article_id, topic, created at, votes, comment_count', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body : { articles } }) => {
                expect(articles).toHaveLength(12)
                articles.forEach((article) => {
                    expect(article).toEqual(
                      expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                      })
                    );
                  });
            })
        });

        test("200: responds with an articles array of article objects, sorted by date in descending order", () => {
            return request(app)
              .get("/api/articles")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).toBeSorted('created_at', {descending : true});
              });
          });
    });

    describe('GET /api/articles/:article_id/comments', () => {
        test('200: responds with an array of comments for the given article_id of which each comment should have comment_id, votes, created_at, author, body', () => {
            return request(app)
            .get('/api/articles/3/comments')
            .expect(200)
            .then(({ body : { comments } }) => {
                expect(comments).toHaveLength(2)
                comments.forEach((comment) => {
                    expect(comment).toEqual(
                      expect.objectContaining({
                        comment_id: expect.any(Number),
                        body: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                      })
                    );
                  });
            })
        });

        test('400: bad request, responds with invalid article id ', () => {
            return request(app)
            .get('/api/articles/uehh/comments')
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('invalid request')
            })
        });
    
        test('404: not found, article id not found', () => {
            return request(app)
            .get('/api/articles/1995/comments')
            .expect(404)
            .then(({ body: { message } }) => {
                expect(message).toBe('id not found')
            })
        })

        test('200: responds with empty array when article id is valid but no comments found', () => {
            return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({ body : { comments } }) => {
                expect(comments).toEqual([])
            })
        });
    });

    describe('GET /api/users', () => {
        test('200: responds with an array of user objects, each with username property', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body : { users } }) => {
                expect(users).toHaveLength(4)
                users.forEach((user) => {
                    expect(user).toEqual(
                      expect.objectContaining({
                        username: expect.any(String),
                      })
                    );
                  });
            })
        });
        test('404: endpoint not found', () => {
            return request(app)
            .get('/api/890978')
            .expect(404)
            .then(({ body: { message } }) => {
                expect(message).toBe('invalid endpoint')
            })
        })
    });

    describe('PATCH /api/articles/:article_id', () => {
        test('200: responds with the updated votes article object', () => {
            const reqBody = { inc_votes : 1 }
            return request(app)
            .patch('/api/articles/3')
            .send(reqBody)
            .expect(200)
            .then(({ body : { updatedArticle } }) => {
                expect(updatedArticle).toEqual(
                    expect.objectContaining({
                        article_id: 3,
                        title: "Eight pug gifs that remind me of mitch",
                        topic: "mitch",
                        author: "icellusedkars",
                        body: "some gifs",
                        created_at: "2020-11-03T09:12:00.000Z",
                        votes: 1, 
                    })
                  )
            })
        });
    
        test('404: not found, article id not found', () => {
            const reqBody = { inc_votes : 1 }
            return request(app)
            .patch('/api/articles/1995')
            .send(reqBody)
            .expect(404)
            .then(({ body: { message } }) => {
                expect(message).toBe('id not found')
            })
        })
    
        test('400: responds with invalid article id ', () => {
            const reqBody = { inc_votes : 1 }
            return request(app)
            .patch('/api/articles/uehh')
            .send(reqBody)
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('invalid request')
            })
        });
    
    
        test('400: invalid value type responds with invalid data type', () => {
            const reqBody = { inc_votes : 'ubbb' }
            return request(app)
            .patch('/api/articles/uehh')
            .send(reqBody)
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('invalid request')
            })
        });
    
        test('400: no value provided, responds with no content', () => {
            const reqBody = {};
            return request(app)
            .patch('/api/articles/3')
            .send(reqBody)
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('no content provided')
            })
        })
    });

    describe.only('POST /api/articles/:article_id/comments', () => {
        test('200: posts a new comment and responds with the new comment object ', () => {
            const body = {username: "icellusedkars", body: 'nice article'}

            return request(app)
            .post('/api/articles/3/comments')
            .send(body)
            .expect(200)
            .then(({ body : {new_comment} }) => {
                expect(new_comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        author: "icellusedkars",
                        body: 'nice article',
                        votes: 0,
                        article_id: 3,
                        created_at: expect.any(String)
                    })
                )
            })
        });

        test('400: username/body incorrect data type', () => {
            const body = {username: 34532, body: 'nice article'}

            return request(app)
            .post('/api/articles/3/comments')
            .send(body)
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('invalid request')
            })
        });

        test('404: username not found', () => {
            const body = {username: "habiba", body: 'nice article'}

            return request(app)
            .post('/api/articles/3/comments')
            .send(body)
            .expect(404)
            .then(({ body: { message } }) => {
                expect(message).toBe('user not found')
            })
        });

        test('400: bad request, responds with invalid article id ', () => {
            const body = {username: "icellusedkars", body: 'nice article'}

            return request(app)
            .post('/api/articles/uehh/comments')
            .send(body)
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('invalid request')
            })
        });
    
        test('404: not found, article id not found', () => {
            const body = {username: "icellusedkars", body: 'nice article'}

            return request(app)
            .post('/api/articles/1995/comments')
            .send(body)
            .expect(404)
            .then(({ body: { message } }) => {
                expect(message).toBe('id not found')
            })
        })

        test('400: no value provided, responds with no content', () => {
            const body = {};
            return request(app)
            .post('/api/articles/3/comments')
            .send(body)
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('no content provided')
            })
        })
    });
});

