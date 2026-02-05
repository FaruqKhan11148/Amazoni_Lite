const cartService = require('../services/cartService');

const addToCart = (req, res) => {
  const userId = req.user._id;

  const productId = Number(req.body.productId);
  const quantity = Number(req.body.quantity);

  cartService.addToCart(userId, productId, quantity, (err, result) => {
    if (err) {
      console.log('CART ERROR:', err);
      return res.send(err);
    }

    res.redirect('/my-cart');
  });
};

const remove = (req, res) => {
  const { productId } = req.body;

  cartService.removeItem(req.user._id, productId, (err) => {
    if (err) {
      return res.render('pages/error', {
        title: 'Cart Error',
        message: 'Unable to remove item from cart',
        redirect: '/my-cart',
      });
    }

    res.redirect('/my-cart');
  });
};

const view = (req, res) => {
  cartService.viewCart(req.user._id, (err, results) => {
    if (err) {
      return res.status(500).render('pages/error', {
        title: 'Cart Error 🛒',
        message: 'Failed to fetch your cart items.',
        redirect: '/',
      });
    }

    res.render('pages/myCart', {
      cartItems: results,
    });
  });
};

// NEW: view cart with total
const getMyCart = (req, res) => {
  cartService.viewCartWithTotal(req.user._id, (err, data) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(data);
  });
};

module.exports = { addToCart, remove, view, getMyCart };
