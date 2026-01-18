const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const { protect } = require('../middlewares/authMiddleware');

// login page
router.get('/login', (req, res) => {
  res.render('pages/login'); // views/auth/login.ejs
});

router.get('/signup', (req, res) => {
  res.render('pages/signup');
});

// get all products
router.get('/products', protect, (req, res) => {
  productService.fetchAllProducts((err, products) => {
    if (err) {
      return res.render('pages/error', {
        message: 'Failed to load products',
      });
    }

    res.render('pages/products', {
      products,
    });
  });
});

// product details
router.get('/products/:id', protect, (req, res) => {
  productService.getProduct(req.params.id, (err, result) => {
    if (err || !result.length) {
      return res.render('pages/error', { message: 'Product not found' });
    }

    res.render('pages/productDetails', {
      product: result[0],
    });
  });
});

module.exports = router;
