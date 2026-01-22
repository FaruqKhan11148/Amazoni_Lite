const addressModel = require('../models/addressModel');
const db=require("../config/db");

const getUserAddresses = (userId, callback) => {
  addressModel.getAllAddresses(userId, callback);
};

// GET SINGLE ADDRESS
const getAddressById = (userId, addressId, callback) => {
  const sql = `SELECT * FROM addresses WHERE id=? AND user_id=?`;
  db.query(sql, [addressId, userId], callback);
};

const addNewAddress = (userId, addressData, callback) => {
  // If address is marked default → clear old default first
  if (addressData.is_default) {
    addressModel.clearDefaultAddress(userId, () => {
      addressModel.createAddress(userId, addressData, callback);
    });
  } else {
    addressModel.createAddress(userId, addressData, callback);
  }
};

const updateUserAddress = (userId, addressId, data, callback) => {
  addressModel.updateAddress(userId, addressId, data, callback);
};

const deleteUserAddress = (userId, addressId, callback) => {
  addressModel.deleteAddress(userId, addressId, callback);
};

module.exports = {
  getUserAddresses,
  getUserAddressById: getAddressById,
  addNewAddress,
  updateUserAddress,
  deleteUserAddress
};
