const db = require("../db/connection");

exports.fetchArticleByID = (id, comments) => {

    // console.log(comments, '<< comments')
    // console.log(typeof comments, '<< type of comments')
    //console.log(comments, '<< comments')

    const queryStr = 'SELECT * FROM articles WHERE article_id = $1';
    const queryValues = [id]

    const queryStrB = 'SELECT comment_id FROM comments WHERE article_id = $1';
    const queryValuesB = [id]

    let promises = [db.query(queryStr, queryValues)]

    if(typeof comments === 'string') {
        promises.push(db.query(queryStrB, queryValuesB))
    }

    return Promise.all(promises).then(([article, commentsRes]) => {
       if (article.rows.length === 0) {
           return Promise.reject({ status: 404, message: 'id not found'})
        } 
        
        const articleObj = article.rows[0];
        if(typeof comments === 'string') {
            const commentCount = commentsRes.rows.length;
            articleObj.comment_count = commentCount;
        }

        return articleObj;
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