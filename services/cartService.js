const cartModel = require('../models/cartModel');

const addToCart = (userId, productId, quantity, callback) => {
  cartModel.addToCart(userId, productId, quantity, callback);
};

const removeItem = (userId, productId, callback) => {
  cartModel.removeFromCart(userId, productId, callback);
};

const viewCart = (userId, callback) => {
  cartModel.getCart(userId, callback);
};

// NEW: view cart with total
const viewCartWithTotal = (userId, callback) => {
  cartModel.getCartWithProducts(userId, (err, items) => {
    if (err) return callback(err);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    callback(null, { items, total });
  });
};

module.exports = { addToCart, removeItem, viewCart, viewCartWithTotal };
