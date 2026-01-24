const productService = require('../services/productService');

// Get all products
const getProducts = (req, res) => {
  productService.fetchAllProducts((err, results) => {
    if (err)
      return res.status(500).json({ message: 'Server error', error: err });
    res.json(results);
  });
};

// Add new product (admin only)
const addProduct = (req, res) => {
  const { name, price, description, stock } = req.body;

  if (!name || !price || stock === undefined) {
    return res.status(400).json({
      message: 'name, price, and stock are required',
    });
  }

  // Cloudinary image URL
  const image_url = req.file ? req.file.path : null;

  productService.createProduct(
    { name, price, description, stock, image_url },
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Server error', error: err });
      }
      res.status(201).json({
        message: 'Product added successfully',
        image_url,
      });
    }
  );
  console.log(req.file);
  console.log(req.body);
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

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  getProduct,
  restockProduct,
};
