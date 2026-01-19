const adminService = require('../services/adminService');


getAllUsers = (req, res) => {
  adminService.fetchAllUsers((err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(users);
  });
};

getAllOrders = (req, res) => {
  adminService.fetchAllOrders((err, orders) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(orders);
  });
};

getLowStockProducts = (req, res) => {
  adminService.fetchLowStockProducts((err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(products);
  });
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllOrders,
  getLowStockProducts
};
