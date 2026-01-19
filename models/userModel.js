const db = require('../config/db');

const createUser = (user, callback) => {
  const {name, email, password } = user;
  db.query(
    'INSERT INTO users (name, email, password) VALUES (?,?,?)',
    [name, email, password],
    callback
  );
};

const findUserByEmail = (email, callback) => {
  db.query('SELECT * FROM users WHERE email= ? ', [email], callback);
};

const getUserById = (userId, callback) => {
  const sql = `
    SELECT id, email, name, created_at
    FROM users
    WHERE id = ?
  `;
  db.query(sql, [userId], callback);
};

const updateUserProfile = (userId, name, email, callback) => {
  const sql = `
    UPDATE users
    SET name = ?, email = ?
    WHERE id = ?
  `;
  db.query(sql, [name, email, userId], callback);
};

const getUserPasswordById = (userId, callback) => {
  const sql = `SELECT password FROM users WHERE id = ?`;
  db.query(sql, [userId], callback);
};

const updateUserPassword = (userId, hashedPassword, callback) => {
  const sql = `UPDATE users SET password = ? WHERE id = ?`;
  db.query(sql, [hashedPassword, userId], callback);
};

module.exports = {
  createUser,
  findUserByEmail,
  getUserById,
  updateUserProfile,
  getUserPasswordById,
  updateUserPassword,
};
