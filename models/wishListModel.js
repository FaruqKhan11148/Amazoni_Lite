const db = require('../config/db');

const findByUserId = async (userId, callback) => {
  const sql = `SELECT w.id, p.* FROM wishlists w JOIN products p ON w.product_id =p.id WHERE w.user_id =?`;
  db.query(sql, [userId], callback);
};

const create = async (userId, productId, callback) => {
  const sql = `INSERT INTO wishlists (user_id, product_id, created_at) VALUES(?,?, NOW())`;
  db.query(sql, [userId, productId], callback);
};

const remove = async (wishlistId, userId, callback) => {
  const sql = `DELETE FROM wishlists WHERE id=? AND user_id=?`;
  db.query(sql, [wishlistId, userId], callback);
};

const exists = async (userId, productId, callback) => {
  const sql = `SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?`;
  db.query(sql, [userId, productId], callback);
};

module.exports = {
  findByUserId,
  create,
  remove,
  exists,
};
