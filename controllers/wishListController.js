const wishListService = require('../services/wishListService');

const getWishList = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await wishListService.getWishList(userId);
    res.render("pages/wishlist", { wishlist: items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addWishList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    if (!product_id) {
      return res.redirect('back');
    }

    await wishListService.addWishList(userId, product_id);

    return res.redirect('/my-wishlist');
  } catch (err) {
    return res.redirect('/my-wishlist');
  }
};


const removeWishList = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishListId = req.params.id;

    await wishListService.removeWishList(userId, wishListId);

    return res.redirect("/my-wishlist");
  } catch (err) {
    console.error(err);
    return res.redirect("/my-wishlist");
  }
};


module.exports = {
  getWishList,
  addWishList,
  removeWishList
};
