const { fetchArticleByID } = require("../model/articles.model");
const { fetchArticleComments, inputCommentByArticle } = require("../model/comments.model");
const { fetchUser } = require("../model/users.model");


exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;

    const promises = [fetchArticleComments( article_id ), fetchArticleByID( article_id )]
    Promise.all(promises).then(([comments]) => {
        res.status(200).send({ comments })
    })
    .catch(next)
}

exports.postCommentByArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    const promises = [fetchArticleByID(article_id), fetchUser(username), inputCommentByArticle(article_id, username, body)];

    Promise.all(promises).then(([_, user, new_comment]) => {
        res.status(200).send({ new_comment })
    })
    .catch(next)
}
