const db = require('../config/db');

const addCoupon = (coupon, callback) => {
  const {
    code,
    discount_percent,
    valid_from,
    valid_to,
    min_order_amount,
    is_active,
  } = coupon;
  const sql = `INSERT INTO coupons (code, discount_percent, valid_from, valid_to, min_order_amount, is_active)
             VALUES (?,?,?,?,?,?)
             `;

  db.query(
    sql,
    [code, discount_percent, valid_from, valid_to, min_order_amount, is_active],
    callback,
  );
};

const getCouponByCode = (code, callback) => {
  const sql = `
    SELECT *
    FROM coupons
    WHERE code = ? AND is_active = 1
  `;
  db.query(sql, [code], callback);
};

module.exports = { getCouponByCode, addCoupon };
