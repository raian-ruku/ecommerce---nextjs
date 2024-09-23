const express = require("express");
const router = express.Router();
const category = require("../models/categories");

router.get("/category-list", async (req, res) => {
  try {
    const result = await category.getList();
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Category list.",
      count: result.length,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error retrieving categories.",
      error: error.message,
    });
  }
});

router.get("/category/:name", async (req, res) => {
  try {
    const categoryName = req.params.name;
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const [result, totalCount] = await Promise.all([
      category.getProductByCategory(categoryName, limit, offset),
      category.getTotalProductCountByCategory(categoryName),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Product list by category.",
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      limit: limit,
      count: result.length,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error retrieving products by category.",
      error: error.message,
    });
  }
});

router.use(express.json());

module.exports = router;
