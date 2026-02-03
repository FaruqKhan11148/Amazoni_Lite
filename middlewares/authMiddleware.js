const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../config/db'); // <-- make sure db is imported

const protect = (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// check blacklist (optional for every protected route)
const isBlacklisted = (token, callback) => {
  const sql = `SELECT id FROM token_blacklist WHERE token = ?`;
  db.query(sql, [token], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length > 0);
  });
};

module.exports = { protect, isBlacklisted };
