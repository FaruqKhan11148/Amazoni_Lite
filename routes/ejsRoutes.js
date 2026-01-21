const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const { protect } = require('../middlewares/authMiddleware');
const authController=require("../controllers/authController");
const orderController = require('../controllers/orderController');
const adminOrderController = require('../controllers/adminOrderController');

// login page
// router.get('/login', (req, res) => {
//   res.render('pages/login'); // views/auth/login.ejs
// });

// router.get('/signup', (req, res) => {
//   res.render('pages/signup');
// });

router.get("/api/getMyProfile", (req, res)=>{res.render("pages/myProfile")});
router.get("/my-orders", protect, orderController.getMyOrders);

module.exports = router;
