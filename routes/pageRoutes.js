const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');

// HOME PAGE
router.get('/', (req, res) => {
  productModel.getAllProducts((err, products) => {
    if (err) return res.status(500).send('Error loading products');

    res.render('pages/home', { products , title: 'Home'});
  });
});

module.exports = router;
