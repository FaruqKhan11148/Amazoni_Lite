const wishListModel = require('../models/wishListModel');

const getWishList = async (userId) => {
  return await wishListModel.findByUserId(userId);
};

const addWishList = async (userId, productId) => {
  const alreadyExists = await wishListModel.exists(userId, productId);

  if (alreadyExists) {
    throw new Error('Already in wishlist');
  }

  await wishListModel.create(userId, productId);
};

const removeWishList = async (userId, wishListId) => {
  await wishListModel.remove(wishListId, userId);
};

module.exports = {
  getWishList,
  addWishList,
  removeWishList,
};
