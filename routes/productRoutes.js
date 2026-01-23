const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');
const productController = require('../controllers/productController');
const upload = require("../middlewares/uploadMiddleware");


// Public
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

router.get('/api/subcategory/:id', (req, res) => {
  const subcategoryId = req.params.id;
  productService.fetchProductsBySubcategory(subcategoryId, (err, products) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err });
    res.json(products);
  });
});

// Admin
router.post('/', protect, adminOnly, upload.single('image'), productController.addProduct);
router.put('/update/:id', protect, adminOnly, productController.updateProduct);
router.patch('/:id/stock', protect, adminOnly, productController.restockProduct);

module.exports = router;
