const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const authService = require('../services/authService');
const { protect } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');
const cartController = require('../controllers/cartController');
const adminOrderController = require('../controllers/adminOrderController');
const wishListController = require('../controllers/wishListController');
const { adminOnly } = require('../middlewares/roleMiddleware');
const productController = require('../controllers/productController');
const orderModel = require('../models/orderModel');

router.get('/signup', (req, res) => res.render('pages/signup'));
router.get('/login', (req, res) => res.render('pages/login'));

router.get('/my-profile', protect, (req, res) => {
  console.log('REQ.USER:', req.user);

  res.render('pages/myProfile', {
    user: req.user,
    success: null,
    error: null,
  });
});

// payments
router.get('/payments', protect, async (req, res) => {
  const orders = await orderModel.getOrdersByUser(req.user.id);

  const unpaidOrders = orders.filter((o) => o.payment_status === 'pending');

  res.render('pages/payments', { orders: unpaidOrders });
});

router.get('/payments/confirm', protect, async (req, res) => {
  const orderIds = req.query.orders;

  if (!orderIds) return res.redirect('/payments');

  res.render('pages/confirmPayment', {
    orderIds: Array.isArray(orderIds) ? orderIds : [orderIds],
  });
});

router.get('/products', protect, productController.getProducts);

router.get('/my-cart', protect, cartController.view);

router.get('/my-orders', protect, orderController.getMyOrders);

router.get('/my-wishlist', protect, wishListController.getWishList);

router.get('/admin', protect, adminOnly, (req, res) => {
  res.render('admin/admin');
});

module.exports = router;
