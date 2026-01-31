const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');
const wishListController = require('../controllers/wishListController');

router.get('/', protect, wishListController.getWishList);
router.post('/add', protect, wishListController.addWishList);
router.post('/remove/:id', protect, wishListController.removeWishList);

module.exports = router;
