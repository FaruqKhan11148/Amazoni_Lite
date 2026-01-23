const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// add product with category
router.get(
    "/subcategories/:categoryId",
    adminController.getSubcategories
);

router.get("/add-product", adminController.renderAddProduct);


const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');

router.use(protect, adminOnly);


router.get('/stats', adminController.getAdminStats);
router.get('/users', adminController.getAllUsers);
router.get('/orders', adminController.getAllOrders);
router.get('/products/low-stock', adminController.getLowStockProducts);



module.exports = router;
