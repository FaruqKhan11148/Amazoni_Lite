// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require('../middlewares/authMiddleware');

// PUBLIC
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// PROTECTED
router.post('/logout', protect, authController.logout);

module.exports = router;
