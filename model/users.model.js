const db = require("../db/connection");

exports.fetchUsers = () => {
    let queryStr = 'SELECT username FROM users';
  
    return db.query(queryStr).then(({ rows }) => {
        return rows;
    })
  }