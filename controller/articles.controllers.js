const { fetchArticleByID, updateArticleByID } = require("../model/articles.model")


exports.getArticleByID = (req, res, next) => {
    const { article_id } = req.params
    
    fetchArticleByID(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
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