const express = require("express");
const router = express.Router();
const categoriesModel = require("../models/categories");

router.get("/category-list", async (req, res) => {
  try {
    const categories = await categoriesModel.getList();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching categories" });
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const {
      page = 1,
      limit = 10,
      minPrice = 0,
      maxPrice = Number.MAX_SAFE_INTEGER,
    } = req.query;
    const offset = (page - 1) * limit;

    const products = await categoriesModel.getProductByCategory(
      category,
      parseInt(limit),
      parseInt(offset),
      parseFloat(minPrice),
      parseFloat(maxPrice),
    );

    const totalCount = await categoriesModel.getTotalProductCountByCategory(
      category,
      parseFloat(minPrice),
      parseFloat(maxPrice),
    );

    res.json({
      success: true,
      data: products,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching products" });
  }
});

router.get("/price-range/:category?", async (req, res) => {
  try {
    const { category } = req.params;
    let priceRange;

    if (category) {
      priceRange = await categoriesModel.getPriceRangeByCategory(category);
    } else {
      priceRange = await categoriesModel.getOverallPriceRange();
    }

    res.json({
      success: true,
      min_price: priceRange.min_price,
      max_price: priceRange.max_price,
    });
  } catch (error) {
    console.error("Error fetching price range:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching price range" });
  }
});

module.exports = router;
