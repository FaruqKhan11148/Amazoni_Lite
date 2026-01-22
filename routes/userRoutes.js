// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const authController = require("../controllers/authController");

router.get('/me', protect, authController.getMe);
router.post('/me', protect, authController.updateMe);
router.post('/change-password', protect, authController.changePassword);

module.exports = router;
