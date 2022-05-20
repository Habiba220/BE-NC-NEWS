const db = require("../db/connection");
const { fetchUsers } = require("./users.model");

exports.fetchArticleComments = (id) => {
    const queryStr = `SELECT comment_id, body, author, created_at, votes FROM comments WHERE article_id = $1`;
    const queryValues = [id];

    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
    })
}

exports.inputCommentByArticle = (id, username, body) => {
    const queryStr = `INSERT INTO comments (body, article_id, author) 
    VALUES ($1, $2, $3)
    RETURNING *`;
    const queryValues = [body, id, username];

    if(!username || !body) {
        return Promise.reject({status: 400, message: 'no content provided'})
    }

    if(typeof username !== 'string' || typeof body !== 'string') {
        return Promise.reject({ status: 400, message: 'invalid request'})
    }
    
    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows[0];
    })  
}