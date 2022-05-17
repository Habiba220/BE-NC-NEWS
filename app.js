const express = require("express");
const { getArticleByID, patchArticleByID } = require("./controller/articles.controllers");
const { invalidEnpointError, customError, internalServerError, PSQLerror } = require("./controller/errors.controllers");
const { getTopics } = require("./controller/topics.controller");

const app = express();
app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleByID)

app.patch('/api/articles/:article_id', patchArticleByID)

app.use("/*", invalidEnpointError );
app.use(PSQLerror)
app.use(customError);
app.use(internalServerError);


  module.exports = app;