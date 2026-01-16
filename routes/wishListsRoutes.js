const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');
const wishListController=require("../controllers/wishListController");

router.use(protect);

router.get("/", wishListController.getWishList);
router.post("/add", wishListController.addWishList);
router.delete("/remove/:id", wishListController.removeWishList);

module.exports = router;