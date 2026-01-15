const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const addressController = require('../controllers/addressController');

router.use(protect);

router.get('/', addressController.getAddresses);
router.post('/', addressController.addAddress);
router.put('/:id', addressController.updateAddress);
router.patch('/:id/default', addressController.setDefaultAddress);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
