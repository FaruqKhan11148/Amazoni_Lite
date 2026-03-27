const adminService = require('../services/adminService');
const productService = require('../services/productService');

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

const getAllUsersForAdmin = (req, res) => {
  adminService.fetchAllUsersWithOrders((err, users) => {
    if (err) return res.status(500).send(err.message);
    res.render("admin/allUsers", { users });
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
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(subcategories);
  });
};

// ================= DASHBOARD PAGE =================
const getDashboard = (req, res) => {
  adminService.fetchAdminStats((err, stats) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    res.render('admin/dashboard', { stats });
  });
};

// ================= ORDERS PAGE =================
const getAllOrdersPage = (req, res) => {
  adminService.fetchAllOrders((err, orders) => {
    if (err) return res.status(500).send('DB error');

    // optional: add empty activities for now
    orders.forEach((order) => {
      order.activities = [];
    });

    res.render('admin/adminOrders', { orders });
  });
};

// ================= ADMIN PRODUCTS PAGE =================
const getAllAdminProductsPage = (req, res) => {
  productService.fetchAllProducts((err, products) => {
    if (err) return res.status(500).send('DB error');
    res.render('admin/adminProducts', { products }); // create this EJS page for admin
  });
};

// ================= ADMIN PRODUCT ACTIONS =================
const addProduct = (req, res) => {
  const { name, price, description, stock } = req.body;
  const image_url = req.file ? req.file.path : null;

  productService.createProduct(
    { name, price, description, stock, image_url },
    (err) => {
      if (err)
        return res.status(500).json({ message: 'Server error', error: err });
      res.redirect('/api/admin/products-admin'); // after add, redirect to admin products page
    },
  );
};

const updateProduct = (req, res) => {
  const { id } = req.params;
  productService.editProduct(id, req.body, (err) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'Failed to update product', error: err });
    res.redirect('/api/admin/products-admin');
  });
};

const restockProduct = (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  if (!quantity || quantity <= 0)
    return res.status(400).json({ message: 'Quantity must be > 0' });

  productService.restockProduct(id, quantity, (err) => {
    if (err)
      return res.status(500).json({ message: 'Failed to restock', error: err });
    res.redirect('/admin/products-admin');
  });
};

const renderEditProductPage = (req, res) => {
  const productId = req.params.id;

  adminService.getProductById(productId, (err, product) => {
    if (err) return res.status(500).send('Server error');
    if (!product) return res.status(404).send('Product not found');

    res.render('admin/adminEditProduct', { product });
  });
};

const renderAddProductPage = (req, res) => {
  res.render('admin/addProduct');
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllOrders,
  getLowStockProducts,
  getSubcategories,
  getDashboard,
  getAllOrdersPage,
  getAllAdminProductsPage,
  addProduct,
  updateProduct,
  restockProduct,
  renderEditProductPage,
  renderAddProductPage,
  getAllUsersForAdmin
};
