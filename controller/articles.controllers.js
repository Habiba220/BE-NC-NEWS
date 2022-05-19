const { fetchArticleByID, updateArticleByID, fetchArticles } = require("../model/articles.model")


exports.getArticleByID = (req, res, next) => {
    const { article_id } = req.params;

    fetchArticleByID(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
  
    const promises = [updateArticleByID(article_id, inc_votes), fetchArticleByID(article_id)];

    Promise.all(promises).then(([updatedArticle]) => {
        res.status(200).send({ updatedArticle })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({ articles })
    })
    .catch(next)
}