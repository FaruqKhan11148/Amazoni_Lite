// const db = require('../config/db');

// const getAllAddresses = (userId, callback) => {
//   const sql = `
//     SELECT *
//     FROM addresses
//     WHERE user_id = ?
//     ORDER BY is_default DESC, createdAt DESC
//   `;
//   db.query(sql, [userId], callback);
// };

// const getAddressById = (userId, addressId, callback) => {
//   const sql = `
//     SELECT *
//     FROM addresses
//     WHERE id = ? AND user_id = ?
//   `;
//   db.query(sql, [addressId, userId], callback);
// };

// const createAddress = (userId, addressData, callback) => {
//   const {
//     address_line1,
//     address_line2,
//     city,
//     state,
//     pincode,
//     country,
//     name,
//     phone,
//     is_default,
//   } = addressData;

//   const sql = `
//     INSERT INTO addresses
//     (user_id, address_line1, address_line2, city, state, pincode, country, name, phone, is_default)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   db.query(
//     sql,
//     [
//       userId,
//       address_line1,
//       address_line2,
//       city,
//       state,
//       pincode,
//       country,
//       name,
//       phone,
//       is_default || 0,
//     ],
//     callback
//   );
// };

// const updateAddress = (userId, addressId, data, callback) => {
//   const sql = `
//     UPDATE addresses
//     SET ?
//     WHERE id = ? AND user_id = ?
//   `;
//   db.query(sql, [data, addressId, userId], callback);
// };

// const deleteAddress = (userId, addressId, callback) => {
//   const sql = `
//     DELETE FROM addresses
//     WHERE id = ? AND user_id = ?
//   `;
//   db.query(sql, [addressId, userId], callback);
// };

// const clearDefaultAddress = (userId, callback) => {
//   const sql = `
//     UPDATE addresses
//     SET is_default = 0
//     WHERE user_id = ?
//   `;
//   db.query(sql, [userId], callback);
// };

// module.exports = {
//   getAllAddresses,
//   getAddressById,
//   createAddress,
//   updateAddress,
//   deleteAddress,
//   clearDefaultAddress,
// };

const db = require('../config/db');

// ============================
// GET ALL ADDRESSES
// ============================
const getAllAddresses = (userId, callback) => {
  const sql = `SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC`;
  db.query(sql, [userId], callback);
};

// ============================
// GET SINGLE ADDRESS (FOR CHECKOUT)
// ============================
const getAddressById = (userId, addressId, callback) => {
  const sql = `
    SELECT *
    FROM addresses
    WHERE id = ? AND user_id = ?
  `;
  db.query(sql, [addressId, userId], callback);
};

// ============================
// CREATE ADDRESS
// ============================
const createAddress = (userId, data, callback) => {
  const sql = `
    INSERT INTO addresses 
    (user_id, name, phone, address_line1, address_line2, city, state, pincode, is_default)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      userId,
      data.name,
      data.phone,
      data.address_line1,
      data.address_line2,
      data.city,
      data.state,
      data.pincode,
      data.is_default ? 1 : 0,
    ],
    callback,
  );
};

// ============================
// CLEAR DEFAULT
// ============================
const clearDefaultAddress = (userId, callback) => {
  const sql = `UPDATE addresses SET is_default = 0 WHERE user_id = ?`;
  db.query(sql, [userId], callback);
};

// ============================
// UPDATE ADDRESS
// ============================
const updateAddress = (userId, addressId, data, callback) => {
  const sql = `
    UPDATE addresses SET
    name=?, phone=?, address_line1=?, address_line2=?,
    city=?, state=?, pincode=?, is_default=?
    WHERE id=? AND user_id=?
  `;

  db.query(
    sql,
    [
      data.name,
      data.phone,
      data.address_line1,
      data.address_line2,
      data.city,
      data.state,
      data.pincode,
      data.is_default ? 1 : 0,
      addressId,
      userId,
    ],
    callback,
  );
};

// ============================
// DELETE ADDRESS
// ============================
const deleteAddress = (userId, addressId, callback) => {
  const sql = `DELETE FROM addresses WHERE id=? AND user_id=?`;
  db.query(sql, [addressId, userId], callback);
};

module.exports = {
  getAllAddresses,
  createAddress,
  getAddressById,
  clearDefaultAddress,
  updateAddress,
  deleteAddress,
};
