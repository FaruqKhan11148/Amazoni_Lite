const cartService = require('../services/cartService');

const add = (req, res) => {
  const { productId, quantity } = req.body;

  cartService.addItem(req.user.id, productId, quantity || 1, (err) => {
    if (err) return res.status(500).json({ message: 'Failed to add to cart', error: err });
    res.json({ message: 'Added to cart' });
  });
};

const remove = (req, res) => {
  const { productId } = req.body;

  cartService.removeItem(req.user.id, productId, (err) => {
    if (err) return res.status(500).json({ message: 'Failed to remove item', error: err });
    res.json({ message: 'Removed from cart' });
  });
};

const view = (req, res) => {
  cartService.viewCart(req.user.id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch cart', error: err });
    res.json(results);
  });
};

// NEW: view cart with total
const getMyCart = (req, res) => {
  cartService.viewCartWithTotal(req.user.id, (err, data) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(data);
  });
};

module.exports = { add, remove, view, getMyCart };
