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

// search product
const searchProducts = (text, callback) => {
  productModel.searchProducts(text, callback);
};


module.exports = {
  createProduct,
  fetchAllProducts,
  getProduct,
  editProduct,
  restockProduct,
  searchProducts
};
