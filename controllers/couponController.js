const cartModel = require('../models/cartModel');
const couponService = require('../services/couponService');

const applyCoupon = (req, res) => {
  const userId = req.user.id;
  const { code } = req.body;

  if (!code) return res.status(400).json({ message: 'Coupon code required' });

  cartModel.getCartWithProducts(userId, (err, cartItems) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (!cartItems.length) return res.status(400).json({ message: 'Cart is empty' });

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    couponService.applyCoupon(code, cartTotal, (err, result) => {
      if (err) return res.status(400).json({ message: err });

      res.json({
        message: 'Coupon applied!',
        discount: result.discount,
        finalTotal: result.finalTotal,
        coupon: result.coupon
      });
    });
  });
};

module.exports = { applyCoupon };
