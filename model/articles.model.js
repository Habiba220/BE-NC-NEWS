const db = require("../db/connection");

exports.fetchArticleByID = (id) => {
    const queryStr = `SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`;
    const queryValues = [id]

    return db.query(queryStr, queryValues).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: 'id not found'})
        } 
        return rows[0];
    })
}



exports.updateArticleByID = (id, incVotes) => {
    const queryStr1 = 'SELECT votes FROM articles WHERE article_id = $1';
    const queryValues1 = [id]

    if(!incVotes) {
        return Promise.reject({status: 400, message: 'no content provided'})
    }
    
    return db.query(queryStr1, queryValues1).then(({ rows }) => {
        const queryStr2 = 'UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *';
        const queryValues2 = [incVotes, id]

        return db.query(queryStr2, queryValues2).then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, message: 'id not found'})
            } 
            return rows[0];
        })
    })
}

exports.fetchArticles = () => {

    const queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, COUNT(comments.comment_id)::INT AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id  ORDER BY articles.created_at DESC`;
   
    return db.query(queryStr).then(({ rows }) => {
        return rows;
    })
}

exports.fetchArticleComments = (id) => {
    const queryStr = `SELECT comment_id, body, author, created_at, votes FROM comments WHERE article_id = $1`;
    const queryValues = [id];

    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
    })
}