const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

// Apply auth to all routes
router.use(protect);

router.get('/', cartController.view);      
router.post('/add', cartController.addToCart);
router.post('/remove', cartController.remove);
// router.get('/my', cartController.getMyCart);

module.exports = router;
