const couponModel = require('../models/couponModel');

const addCoupon = (coupon, callback) => {
  couponModel.addCoupon(coupon, callback);
};

const applyCoupon = (code, cartTotal, callback) => {
  couponModel.getCouponByCode(code, (err, results) => {
    if (err) return callback(err);
    if (!results.length) return callback('Invalid or inactive coupon');

    const coupon = results[0];
    const today = new Date();

    if (
      today < new Date(coupon.valid_from) ||
      today > new Date(coupon.valid_to)
    ) {
      return callback('Coupon expired');
    }

    if (cartTotal < coupon.min_order_amount) {
      return callback(`Cart total must be at least ${coupon.min_order_amount}`);
    }

    const discount = (cartTotal * coupon.discount_percent) / 100;
    const finalTotal = cartTotal - discount;

    callback(null, { discount, finalTotal, coupon });
  });
};

module.exports = { applyCoupon, addCoupon };
