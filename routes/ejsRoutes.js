const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const { protect } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');
const cartController = require('../controllers/cartController');
const adminOrderController = require('../controllers/adminOrderController');
const wishListController = require('../controllers/wishListController');
const { adminOnly } = require('../middlewares/roleMiddleware');

router.get('/signup', (req, res) => res.render('pages/signup'));
router.get('/login', (req, res) => res.render('pages/login'));

router.get('/my-profile', protect, (req, res) => {
  res.render('pages/myProfile');
});

router.get('/my-cart', protect, cartController.view);

router.get('/my-orders', protect, orderController.getMyOrders);

router.get('/my-wishlist', protect, wishListController.getWishList);

router.get('/admin', protect, adminOnly, (req,res)=>{
    res.render("admin/admin");
});

module.exports = router;
