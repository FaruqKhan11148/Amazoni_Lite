const addressModel = require('../models/addressModel');

const getUserAddresses = (userId, callback) => {
  addressModel.getAllAddresses(userId, callback);
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

const setUserDefaultAddress = (userId, addressId, callback) => {
  addressModel.clearDefaultAddress(userId, () => {
    addressModel.setDefaultAddress(userId, addressId, callback);
  });
};

const deleteUserAddress = (userId, addressId, callback) => {
  addressModel.deleteAddress(userId, addressId, callback);
};

module.exports = {
  getUserAddresses,
  addNewAddress,
  updateUserAddress,
  setUserDefaultAddress,
  deleteUserAddress
};
