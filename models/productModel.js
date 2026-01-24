const db = require("../config/db");

// Get all products
const getAllProducts = (callback) => {
  const sql = `
    SELECT id, name, description, price, stock, image_url, created_at
    FROM products
    ORDER BY created_at DESC
  `;
  db.query(sql, callback);
};

// Create a new product
const createProduct = (product, callback) => {
  const { name, price, description, stock = 0, image_url } = product;

  const sql = `
    INSERT INTO products (name, price, description, stock, image_url)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, price, description, stock, image_url], callback);
};


// Optional: update product (price/stock/description)
const updateProduct = (id, product, callback) => {
  const { name, price, description, stock } = product;
  const sql = `
    UPDATE products
    SET name = ?, price = ?, description = ?, stock = ?
    WHERE id = ?
  `;
  db.query(sql, [name, price, description, stock, id], callback);
};

// update stock
const updateStock = (productId, quantity, callback) => {
  const sql = `
    UPDATE products
    SET stock = stock + ?
    WHERE id = ?
  `;
  db.query(sql, [quantity, productId], callback);
};


// Optional: get single product by id
const getProductById = (id, callback) => {
  const sql = `SELECT * FROM products WHERE id = ?`;
  db.query(sql, [id], callback);
};

module.exports = { getAllProducts, createProduct, updateProduct, getProductById, updateStock };
