const wishListService = require('../services/wishListService');

const getWishList = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await wishListService.getWishList(userId);
    res.status(200).json(items||{});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addWishList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;
    
    if (!product_id) {
        return res.status(400).json({ message: 'Product Id required!' });
    }
    
    await wishListService.addWishList(userId, product_id);
    res.status(201).json({ message: 'added to wish list' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeWishList = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishListId = req.params.id;

    await wishListService.removeWishList(userId, wishListId);
    res.status(200).json({ message: 'Removed from wish list' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getWishList,
  addWishList,
  removeWishList
};
