const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const couponController = require('../controllers/couponController');

router.get('/', protect, (req, res) => {
  res.render('pages/addCoupon');
});
router.post('/add', protect, couponController.addCoupon);
router.post('/apply', protect, couponController.applyCoupon);

module.exports = router;
