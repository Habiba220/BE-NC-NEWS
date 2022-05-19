const db = require("../db/connection");

exports.fetchArticleComments = (id) => {
    const queryStr = `SELECT comment_id, body, author, created_at, votes FROM comments WHERE article_id = $1`;
    const queryValues = [id];

    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
    })
}