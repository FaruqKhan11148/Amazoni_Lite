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
  const { name, price, description, stock = 0, image_url, category_id, subcategory_id } = product;

  const sql = `
  INSERT INTO products 
  (name, price, description, stock, image_url, category_id, subcategory_id)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

db.query(sql, [name, price, description, stock, image_url, category_id, subcategory_id], callback);
};

// Update product
const updateProduct = (id, product, callback) => {
  const { name, price, description, stock, category_id, subcategory_id } = product;
  const sql = `
    UPDATE products
    SET name = ?, price = ?, description = ?, stock = ?, category_id = ?, subcategory_id = ?
    WHERE id = ?
  `;
  db.query(sql, [name, price, description, stock, category_id, subcategory_id, id], callback);
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

const getCategoriesWithSub = (callback) => {
  const sql = `
    SELECT c.id AS category_id, c.name AS category_name, c.icon,
           s.id AS subcategory_id, s.name AS subcategory_name,
           IFNULL(SUM(p.stock),0) AS stock
    FROM categories c
    LEFT JOIN subcategories s ON s.category_id = c.id
    LEFT JOIN products p ON p.subcategory_id = s.id
    GROUP BY c.id, s.id
    ORDER BY c.name, s.name
  `;

  db.query(sql, callback);
};

module.exports = { getAllProducts, createProduct, updateProduct, getProductById, updateStock, getCategoriesWithSub };
