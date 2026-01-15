const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const couponController = require('../controllers/couponController');

router.post('/apply', protect, couponController.applyCoupon);

module.exports = router;

