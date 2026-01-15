const db = require('../config/db');

const getAllAddresses = (userId, callback) => {
  const sql = `
    SELECT *
    FROM addresses
    WHERE user_id = ?
    ORDER BY is_default DESC, created_at DESC
  `;
  db.query(sql, [userId], callback);
};

const getAddressById = (userId, addressId, callback) => {
  const sql = `
    SELECT *
    FROM addresses
    WHERE id = ? AND user_id = ?
  `;
  db.query(sql, [addressId, userId], callback);
};

const createAddress = (userId, addressData, callback) => {
  const {
    address_line1,
    address_line2,
    city,
    state,
    pincode,
    country,
    name,
    phone,
    is_default,
  } = addressData;

  const sql = `
    INSERT INTO addresses
    (user_id, address_line1, address_line2, city, state, pincode, country, name, phone, is_default)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      userId,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country,
      name,
      phone,
      is_default || 0,
    ],
    callback
  );
};

const updateAddress = (userId, addressId, data, callback) => {
  const sql = `
    UPDATE addresses
    SET ?
    WHERE id = ? AND user_id = ?
  `;
  db.query(sql, [data, addressId, userId], callback);
};

const deleteAddress = (userId, addressId, callback) => {
  const sql = `
    DELETE FROM addresses
    WHERE id = ? AND user_id = ?
  `;
  db.query(sql, [addressId, userId], callback);
};

const clearDefaultAddress = (userId, callback) => {
  const sql = `
    UPDATE addresses
    SET is_default = 0
    WHERE user_id = ?
  `;
  db.query(sql, [userId], callback);
};

const setDefaultAddress = (userId, addressId, callback) => {
  const sql = `
    UPDATE addresses
    SET is_default = 1
    WHERE id = ? AND user_id = ?
  `;
  db.query(sql, [addressId, userId], callback);
};

module.exports = {
  getAllAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  clearDefaultAddress,
  setDefaultAddress,
};
