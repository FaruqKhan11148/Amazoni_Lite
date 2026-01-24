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

router.get('/signup', (req, res) => res.render('pages/signup'));
router.get('/login', (req, res) => res.render('pages/login'));

router.get('/my-profile', protect, (req, res) => {
  res.render('pages/myProfile', {
    user: req.user,
    success: null,
    error: null,
  });
});

// router.get("/", (req, res) => {
//   productService.fetchHomeSections((err, data) => {
//     if (err) {
//       return res.render("pages/home", {
//         newArrivals: [],
//         trending: [],
//         topRated: []
//       });
//     }

//     res.render("pages/home", {
//       newArrivals: data.newArrivals,
//       trending: data.trending,
//       topRated: data.topRated
//     });
//   });
// });

router.get('/products', protect, productController.getProducts);

router.get('/my-cart', protect, cartController.view);

router.get('/my-orders', protect, orderController.getMyOrders);

router.get('/my-wishlist', protect, wishListController.getWishList);

router.get('/admin', protect, adminOnly, (req, res) => {
  res.render('admin/admin');
});

module.exports = router;
