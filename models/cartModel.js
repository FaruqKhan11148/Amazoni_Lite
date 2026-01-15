const db = require('../config/db');

const addToCart = (userId, productId, quantity, callback) => {
  // Check current stock first
  db.query(
    'SELECT stock FROM products WHERE id = ?',
    [productId],
    (err, result) => {
      if (err) return callback(err);
      if (!result.length) return callback('Product not found');

      const stock = result[0].stock;
      if (quantity > stock) return callback('Quantity exceeds available stock');

      // Insert/update cart
      const sql = `
      INSERT INTO cart (user_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        quantity = quantity + VALUES(quantity),
        updated_at = CURRENT_TIMESTAMP
    `;
      db.query(sql, [userId, productId, quantity], callback);
    }
  );
};

const removeFromCart = (userId, productId, callback) => {
  db.query(
    'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
    [userId, productId],
    callback
  );
};

const getCart = (userId, callback) => {
  const sql = `
    SELECT 
      c.id AS cart_id,
      c.product_id,
      c.quantity,
      c.created_at,
      c.updated_at,
      p.name,
      p.price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;
  db.query(sql, [userId], callback);
};

// NEW: get cart with only product_id, quantity, price (for orders)
const getCartWithProducts = (userId, callback) => {
  const sql = `
    SELECT c.product_id, p.name, c.quantity, p.price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;
  db.query(sql, [userId], callback);
};

module.exports = { addToCart, removeFromCart, getCart, getCartWithProducts };
