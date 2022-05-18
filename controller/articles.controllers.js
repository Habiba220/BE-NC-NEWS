const { fetchArticleByID, updateArticleByID } = require("../model/articles.model")


exports.getArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    const { comment_count } = req.query;

    fetchArticleByID(article_id, comment_count).then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    
    const promises = [fetchArticleByID(article_id), updateArticleByID(article_id, inc_votes)];

    Promise.all(promises).then(([_, updatedArticle]) => {
        res.status(200).send({ updatedArticle })
    })
    .catch((err) => {
        next(err)
    })
}