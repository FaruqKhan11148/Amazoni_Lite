const db = require("../config/db");

const insertToken = (token, expiresAt, callback) => {
  const sql = `
    INSERT INTO token_blacklist (token, expires_at)
    VALUES (?, ?)
  `;

  db.query(sql, [token, expiresAt], callback);
};

module.exports = {
  insertToken
};
