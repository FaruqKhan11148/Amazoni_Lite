const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');

// login page
router.get('/login', (req, res) => {
  res.render('pages/login'); // views/auth/login.ejs
});

router.get("/signup", (req, res)=>{
  res.render("pages/signup");
})

module.exports = router;
