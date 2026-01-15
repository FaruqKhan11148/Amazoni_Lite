const db = require('../config/db');

const getDashboardStats = (callback) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM orders) AS totalOrders,
      (SELECT IFNULL(SUM(total), 0)
       FROM orders
       WHERE payment_status = 'success') AS totalRevenue,
      (SELECT COUNT(*)
       FROM orders
       WHERE DATE(created_at) = CURDATE()) AS todayOrders
  `;

  db.query(sql, callback);
};

const getAllUsers = (callback) => {
  const sql = `
    SELECT id, email, name, role, created_at
    FROM users
    ORDER BY created_at DESC
  `;
  db.query(sql, callback);
};

const getAllOrders = (callback) => {
  const sql = `
    SELECT id, user_id, total, payment_status, payment_method,
           order_status, created_at
    FROM orders
    ORDER BY created_at DESC
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

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  getLowStockProducts
};
