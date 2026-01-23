const adminService = require('../services/adminService');

// ================= DASHBOARD =================
const getAdminStats = (req, res) => {
  adminService.fetchAdminStats((err, stats) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(stats);
  });
};

const getAllUsers = (req, res) => {
  adminService.fetchAllUsers((err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(users);
  });
};

const getAllOrders = (req, res) => {
  adminService.fetchAllOrders((err, orders) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(orders);
  });
};

const getLowStockProducts = (req, res) => {
  adminService.fetchLowStockProducts((err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(products);
  });
};

// ================= SUBCATEGORIES =================
const getSubcategories = (req, res) => {
  const categoryId = req.params.categoryId;

  adminService.getSubcategories(categoryId, (err, subcategories) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json(subcategories);
  });
};

// ================= ADD PRODUCT PAGE =================
const renderAddProduct = (req, res) => {
  adminService.renderAddProduct(req, res);
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllOrders,
  getLowStockProducts,
  getSubcategories,
  renderAddProduct // ✅ THIS WAS MISSING
};
