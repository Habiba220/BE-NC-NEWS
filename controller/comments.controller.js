const { fetchArticleByID } = require("../model/articles.model");
const { fetchArticleComments } = require("../model/comments.model");


exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;

    const promises = [fetchArticleComments( article_id ), fetchArticleByID( article_id )]
    Promise.all(promises).then(([comments]) => {
        res.status(200).send({ comments })
    })
    .catch(next)
}