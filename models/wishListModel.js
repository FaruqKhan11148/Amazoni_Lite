const db = require('../config/db');

// const findByUserId = (userId) => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       SELECT w.id, p.*
//       FROM wishlists w
//       JOIN products p ON w.product_id = p.id
//       WHERE w.user_id = ?
//     `;
//     db.query(sql, [userId], (err, rows) => {
//       if (err) reject(err);
//       else resolve(rows);
//     });
//   });
// };

const findByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        w.id AS wishlist_id,
        w.product_id AS product_id,
        p.id AS product_real_id,
        p.name,
        p.price,
        p.image_url,
        p.stock
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
    `;

    db.query(sql, [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};


const exists = (userId, productId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?`;
    db.query(sql, [userId, productId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows.length > 0);
    });
  });
};

const create = (userId, productId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO wishlists (user_id, product_id, created_at)
      VALUES (?, ?, NOW())
    `;
    db.query(sql, [userId, productId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const remove = (wishlistId, userId) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM wishlists WHERE id = ? AND user_id = ?`;
    db.query(sql, [wishlistId, userId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

module.exports = {
  findByUserId,
  exists,
  create,
  remove,
};
