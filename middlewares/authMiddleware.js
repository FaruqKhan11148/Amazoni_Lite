const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../config/db'); // <-- make sure db is imported

dotenv.config();

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // decoded payload
    req.token = token; // store token for logout
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
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
