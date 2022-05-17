const db = require("../db/connection");

exports.fetchArticleByID = (id) => {
    const queryStr = 'SELECT * FROM articles WHERE article_id = $1';
    const queryValues = [id]

    return db.query(queryStr, queryValues).then(({ rows }) => {
        
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: 'id not found'})
        } 
        return rows[0];
    })
  }