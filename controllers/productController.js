const productService = require('../services/productService');

// Get all products
const getProducts = (req, res) => {
  productService.fetchAllProducts((err, products) => {
    if (err)
      return res.status(500).json({ message: 'Server error', error: err });
    res.render("pages/products", {products });
  });
};

// Add new product (admin only)
const addProduct = (req, res) => {
  const { name, price, description, stock, category_id, subcategory_id } = req.body;

  // Validate all required fields
  if (!name || !price || stock === undefined || !category_id || !subcategory_id) {
    return res.status(400).json({
      message: 'All fields including category, subcategory, and stock are required',
    });
  }

  // Cloudinary image URL
  const image_url = req.file ? req.file.path : null;

  // Create product object
  const product = {
    name,
    price,
    description,
    stock,
    category_id,
    subcategory_id,
    image_url
  };

  // Call service
  productService.createProduct(product, (err) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err });

    res.status(201).json({
      message: 'Product added successfully',
      image_url
    });
  });
};

// Optional: update product
const updateProduct = (req, res) => {
  const { id } = req.params;
  productService.editProduct(id, req.body, (err) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'Failed to update product', error: err });
    res.json({ message: 'Product updated' });
  });
};

// Optional: get product by id
const getProduct = (req, res) => {
  const { id } = req.params;
  productService.getProduct(id, (err, results) => {
    if (err)
      return res.status(500).json({ message: 'Server error', error: err });
    if (!results.length)
      return res.status(404).json({ message: 'Product not found' });
    res.json(results[0]);
  });
};

// update stocks
const restockProduct = (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be > 0' });
  }

  productService.restockProduct(id, quantity, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to restock', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Stock updated successfully' });
  });
};

const renderSidebar = (req, res, next) => {
  categoryService.fetchCategoriesWithSub((err, categories) => {
    if (err) return next(err);

    res.locals.categories = categories; // now available in all EJS views
    next();
  });
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  getProduct,
  restockProduct,
  renderSidebar
};
