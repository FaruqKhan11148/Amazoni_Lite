// middlewares/renderSidebar.js
const productService = require('../services/productService');

const renderSidebar = (req, res, next) => {
  productService.fetchCategoriesWithSub((err, categories) => {
    if (err) {
      res.locals.categories = []; // fallback
    } else {
      res.locals.categories = categories;
    }
    next();
  });
};

module.exports = renderSidebar;
