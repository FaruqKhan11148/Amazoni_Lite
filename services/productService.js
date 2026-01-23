const productModel = require('../models/productModel');

// Create product
const createProduct = (product, callback) => {
  productModel.createProduct(product, callback);
};

// Fetch all products
const fetchAllProducts = (callback) => {
  productModel.getAllProducts(callback);
};

// Get single product by id
const getProduct = (id, callback) => {
  productModel.getProductById(id, callback);
};

// Edit product
const editProduct = (id, data, callback) => {
  productModel.updateProduct(id, data, callback);
};

// update stock
const restockProduct = (productId, quantity, callback) => {
  productModel.updateStock(productId, quantity, callback);
};

const fetchCategoriesWithSub = (callback) => {
  productModel.getCategoriesWithSub((err, results) => {
    if (err) return callback(err);

    // Convert flat result to nested structure
    const categoriesMap = {};
    results.forEach(row => {
      if (!categoriesMap[row.category_id]) {
        categoriesMap[row.category_id] = {
          id: row.category_id,
          name: row.category_name,
          icon: row.icon,
          subcategories: []
        };
      }
      if (row.subcategory_id) {
        categoriesMap[row.category_id].subcategories.push({
          id: row.subcategory_id,
          name: row.subcategory_name,
          stock: row.stock
        });
      }
    });

    callback(null, Object.values(categoriesMap));
  });
};

const fetchProductsBySubcategory = (subcategoryId, callback) => {
  const sql = `SELECT * FROM products WHERE subcategory_id = ? ORDER BY created_at DESC`;
  db.query(sql, [subcategoryId], callback);
};

module.exports = {
  createProduct,
  fetchAllProducts,
  getProduct,
  editProduct,
  restockProduct,
  fetchCategoriesWithSub,
  fetchProductsBySubcategory
};
