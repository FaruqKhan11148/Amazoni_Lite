const wishListModel = require('../models/wishListModel');

const getWishList = async (userId) => {
  return await wishListModel.findByUserId(userId);
};

const addWishList = async (userId, productId) => {
  const alreadyExists = await wishListModel.exists(userId, productId);

  if (alreadyExists) {
    return res.status(500).json({ message: 'Already in wishlist' });
  }

  await wishListModel.create(userid, productId);
};

const removeWishList = async (userId, productId) => {
  await wishListModel.remove(wishListId, userId);
};

module.exports = {
  getWishList,
  addWishList,
  removeWishList,
};
