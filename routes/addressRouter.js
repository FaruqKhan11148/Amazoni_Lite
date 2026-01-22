const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const addressController = require('../controllers/addressController');

router.use(protect);

// pages
router.get('/', addressController.checkoutAddressPage);
router.get('/new', addressController.addAddressPage);
router.get('/edit/:id', addressController.editAddressPage);

// actions
router.post('/', addressController.createAddress);
router.post('/update/:id', addressController.updateAddress);
router.post('/delete/:id', addressController.deleteAddress);

module.exports = router;
