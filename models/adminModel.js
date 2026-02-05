const db = require('../config/db');

const getDashboardStats = (callback) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM users) AS totalUsers,

      (SELECT COUNT(*) FROM products) AS totalProducts,
      (SELECT COUNT(*) FROM products WHERE stock <= 5) AS lowStockProducts,

      (SELECT COUNT(*) FROM orders) AS totalOrders,

      (SELECT COUNT(*) FROM orders WHERE order_status = 'paid') AS paidOrders,
      (SELECT COUNT(*) FROM orders WHERE order_status = 'shipped') AS shippedOrders,
      (SELECT COUNT(*) FROM orders WHERE order_status = 'out_for_delivery') AS outForDeliveryOrders,
      (SELECT COUNT(*) FROM orders WHERE order_status = 'delivered') AS deliveredOrders,
      (SELECT COUNT(*) FROM orders WHERE order_status = 'cancelled') AS cancelledOrders,

      (SELECT IFNULL(SUM(total),0)
         FROM orders
         WHERE payment_status = 'success') AS totalRevenue
  `;

  db.query(sql, callback);
};

const getAllUsers = (callback) => {
  const sql = `
    SELECT id, email, name, role, createdAt
    FROM users
    ORDER BY createdAt DESC
  `;
  db.query(sql, callback);
};

const getAllOrders = (callback) => {
  const sql = `
    SELECT id, user_id, total, payment_status, payment_method,
           order_status, createdAt
    FROM orders
    ORDER BY createdAt DESC
  `;
  db.query(sql, callback);
};

const getLowStockProducts = (callback) => {
  const sql = `
    SELECT id, name, stock
    FROM products
    WHERE stock <= 10
    ORDER BY stock ASC
  `;
  db.query(sql, callback);
};

const getSubcategoriesByCategory = (categoryId, callback) => {
  const sql = 'SELECT id, name FROM subcategories WHERE category_id = ?';

  db.query(sql, [categoryId], callback);
};

const getAllCategories = (callback) => {
  const sql = 'SELECT id, name FROM categories ORDER BY name';
  db.query(sql, callback);
};

const getProductById = (productId, callback) => {
  const sql = 'SELECT * FROM products WHERE id = ?';
  db.query(sql, [productId], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]); // return only the first row
  });
};

const getAllUsersWithOrderCount = (callback) => {
  const sql = `
    SELECT 
      u.id,
      u.name,
      u.email,
      COUNT(o.id) AS totalOrders
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id
  `;

  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  getLowStockProducts,
  getSubcategoriesByCategory,
  getAllCategories,
  getProductById,
  getAllUsersWithOrderCount,
};
