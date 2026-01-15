const adminModel = require('../models/adminModel');

const fetchAdminStats = (callback) => {
  adminModel.getDashboardStats((err, result) => {
    if (err) return callback(err);
    callback(null, result[0]);
  });
};

const fetchAllUsers = (callback) => {
  adminModel.getAllUsers((err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

const fetchAllOrders = (callback) => {
  adminModel.getAllOrders((err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

const fetchLowStockProducts = (callback) => {
  adminModel.getLowStockProducts((err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

module.exports = {
  fetchAdminStats,
  fetchAllUsers,
  fetchAllOrders,
  fetchLowStockProducts
};
