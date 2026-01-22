const cartService = require('../services/cartService');

const addToCart = (req, res) => {
  const userId = req.user.id;
  const productId = req.body.productId;

  // Always add 1 on button click
  cartService.addToCart(userId, productId, 1, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Cart error');
    }
    res.redirect('/my-cart'); // or JSON if using AJAX
  });
};


const remove = (req, res) => {
  const { productId } = req.body;

  cartService.removeItem(req.user.id, productId, (err) => {
    if (err) {
      return res.render("pages/error", {
        title: "Cart Error",
        message: "Unable to remove item from cart",
        redirect: "/my-cart"
      });
    }

    res.redirect('/my-cart');
  });
};

const view = (req, res) => {
  cartService.viewCart(req.user.id, (err, results) => {
    if (err) {
      return res.status(500).render("pages/error", {
        title: "Cart Error 🛒",
        message: "Failed to fetch your cart items.",
        redirect: "/"
      });
    }

    res.render("pages/myCart", {
      cartItems: results
    });
  });
};

// NEW: view cart with total
const getMyCart = (req, res) => {
  cartService.viewCartWithTotal(req.user.id, (err, data) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(data);
  });
};

module.exports = { addToCart, remove, view, getMyCart };
