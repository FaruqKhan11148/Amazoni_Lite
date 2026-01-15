const db = require('../config/db');

const getCouponByCode = (code, callback) => {
  const sql = `
    SELECT *
    FROM coupons
    WHERE code = ? AND is_active = 1
  `;
  db.query(sql, [code], callback);
};

module.exports = { getCouponByCode };
