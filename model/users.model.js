const { rows } = require("pg/lib/defaults");
const db = require("../db/connection");

exports.fetchUsers = () => {
    const queryStr = 'SELECT username FROM users';

    return db.query(queryStr).then(({ rows }) => {
        return rows;
    })
  }

  exports.fetchUser = (username) => {
    const queryStr = `SELECT * FROM users WHERE username = $1`
    const queryValues = [username]

    return db.query(queryStr, queryValues).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: 'user not found'})
        } 
        return rows[0];
    })
}