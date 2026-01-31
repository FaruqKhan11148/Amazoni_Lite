const express = require("express");
const router = express.Router();
const productService = require("../services/productService");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, (req, res) => {
  const searchText = req.query.q || "";

  productService.searchProducts(searchText, (err, results) => {
    if (err) {
      console.log(err);
      return res.render("pages/searchResults", {
        products: [],
        searchText
      });
    }

    res.render("pages/searchResults", {
      products: results || [],
      searchText
    });
  });
});


module.exports = router;
