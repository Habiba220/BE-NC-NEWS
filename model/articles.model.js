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
        
        let { votes } = rows[0];
        votes += incVotes
         
        const queryStr2 = 'UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *';
        const queryValues2 = [votes, id]

        return db.query(queryStr2, queryValues2).then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, message: 'id not found'})
            } 
            return rows[0];
        })
    })
}