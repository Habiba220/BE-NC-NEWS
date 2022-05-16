const express = require("express");
const { getTopics } = require("./controller/topics.controller");

const app = express();

app.get('/api/topics', getTopics)

app.use("/*", (req, res, next) => {
    res.status(404).send({ message: "Invalid endpoint" });
  });
  
app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ message: err.message });
    } else {
      next(err);
    }
  });
  
  app.use((err, req, res, next) => {
    res.status(500).send({ message: "Internal server error" });
  });
  
  module.exports = app;