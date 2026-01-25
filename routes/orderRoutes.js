const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');

const orderController = require('../controllers/orderController');
const adminOrderController = require('../controllers/adminOrderController');

// USER ORDER ROUTES

// Place order
router.post('/checkout', protect, orderController.checkout);

// Get my orders (paginated)
router.get("/", protect, orderController.getMyOrdersPaginated);

// Get my orders (non-paginated – optional / legacy)
router.get('/my', protect, orderController.getMyOrders);

// Get single order
router.get('/:orderId', protect, orderController.getOrderById);

// Order timeline
router.get('/:id/timeline', protect, orderController.getOrderTimeline);

// Cancel order
router.patch('/:id/cancel', protect, orderController.cancelOrder);

// Mark order paid
router.put('/:orderId/pay', protect, orderController.markPaid);

router.put("/pay-multiple", protect, orderController.payMultipleOrders);



// ADMIN ORDER ROUTES

router.patch(
  '/admin/:id/status',
  protect,
  adminOnly,
  adminOrderController.updateOrderStatus
);

module.exports = router;
