const db = require('../config/db');

const getCartWithProducts = (userId, callback) => {
  const sql = `
    SELECT c.product_id, c.quantity, p.price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;
  db.query(sql, [userId], callback);
};

const createOrder = (
  userId,
  total,
  shippingAddress,
  coupon_code = null,
  discount = 0,
  callback,
) => {
  const addressString =
    typeof shippingAddress === 'object'
      ? JSON.stringify(shippingAddress)
      : shippingAddress;

  db.query(
    `INSERT INTO orders 
     (user_id, total, shipping_address, coupon_code, discount_amount)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, total, addressString, coupon_code, discount],
    callback,
  );
};

const addOrderItem = (orderId, productId, quantity, price, callback) => {
  db.query(
    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
    [orderId, productId, quantity, price],
    callback,
  );
};

const clearCart = (userId, callback) => {
  db.query('DELETE FROM cart WHERE user_id = ?', [userId], callback);
};

const getOrderWithItems = (orderId, userId, callback) => {
  const sql = `
    SELECT 
      o.id AS order_id,
      o.total,
      o.createdAt,
      oi.product_id,
      oi.quantity,
      oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.id = ? AND o.user_id = ?
  `;
  db.query(sql, [orderId, userId], callback);
};

const getOrdersByUser = async (userId) => {
  const sql = `
    SELECT id, total, discount_amount AS discount, coupon_code,
           createdAt, payment_status, order_status
    FROM orders
    WHERE user_id = ?
    ORDER BY createdAt DESC
  `;

  const [rows] = await db.promise().query(sql, [userId]);
  return rows;
};

const markOrderPaid = (
  orderId,
  userId,
  method,
  transactionId,
  isAdmin = false,
  callback,
) => {
  const sql = `
    UPDATE orders
    SET 
      payment_status = 'success',
      payment_method = ?,
      transaction_id = ?,
      order_status = 'paid'
    WHERE 
      id = ?
      ${!isAdmin ? 'AND user_id = ?' : ''}
      AND payment_status = 'pending'
  `;
  const params = !isAdmin
    ? [method, transactionId, orderId, userId]
    : [method, transactionId, orderId];

  db.query(sql, params, callback);
};

const reduceStock = (productId, quantity, callback) => {
  const sql = `
    UPDATE products
    SET stock = stock - ?
    WHERE id = ? AND stock >= ?
  `;
  db.query(sql, [quantity, productId, quantity], callback);
};

// Cancel order (user)
const cancelOrder = (orderId, userId, callback) => {
  const sql = `
    UPDATE orders
    SET order_status = 'cancelled'
    WHERE id = ? 
      AND user_id = ?
      AND order_status IN ('created', 'paid')
  `;
  db.query(sql, [orderId, userId], callback);
};

// Admin: update order status
const updateOrderStatus = (orderId, status, callback) => {
  const sql = `
    UPDATE orders
    SET order_status = ?
    WHERE id = ?
  `;
  db.query(sql, [status, orderId], callback);
};

// Pagination
const getOrdersByUserPaginated = (userId, limit, offset, callback) => {
  const sql = `
    SELECT id, total, order_status, payment_status, createdAt
    FROM orders
    WHERE user_id = ?
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `;
  db.query(sql, [userId, limit, offset], callback);
};

// Timeline log
const addOrderStatusLog = (orderId, status, callback) => {
  db.query(
    'INSERT INTO order_status_logs (order_id, status) VALUES (?, ?)',
    [orderId, status],
    callback,
  );
};

const getOrderTimeline = (orderId, callback) => {
  db.query(
    'SELECT status, createdAt FROM order_status_logs WHERE order_id = ? ORDER BY createdAt',
    [orderId],
    callback,
  );
};

const getOrderById = (orderId, callback) => {
  const sql = `
    SELECT id, order_status, payment_status
    FROM orders
    WHERE id = ?
  `;
  db.query(sql, [orderId], callback);
};

const getOrder = (userId, orderId, callback) => {
  db.query(
    'SELECT * FROM orders WHERE id=? AND user_id=?',
    [orderId, userId],
    callback,
  );
};

const beginTransaction = (callback) => {
  db.beginTransaction(callback);
};

const commit = (callback) => {
  db.commit(callback);
};

const rollback = (callback) => {
  db.rollback(callback);
};

// get product by id
const getProductById = (productId, callback) => {
  const sql = `
    SELECT id, price, stock 
    FROM products 
    WHERE id = ?
  `;
  db.query(sql, [productId], callback);
};

module.exports = {
  getCartWithProducts,
  createOrder,
  addOrderItem,
  clearCart,
  getOrderWithItems,
  getOrdersByUser,
  getOrder,
  reduceStock,
  markOrderPaid,
  beginTransaction,
  commit,
  rollback,
  cancelOrder,
  updateOrderStatus, // adminOnly
  getOrdersByUserPaginated,
  addOrderStatusLog, // adminOnly
  getOrderTimeline,
  getOrderById,
  getProductById,
};
