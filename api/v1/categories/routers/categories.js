const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();

const category = require("../models/categories");

require("dotenv").config();

router.get("/category-list", async (req, res) => {
  let result = await category.getList(
    { id: "ASC" },

    ["id", "category_name"],
  );

  return res.status(200).send({
    success: true,
    status: 200,
    message: "Category list.",
    count: result.length,
    data: result,
  });
});

// TODO: Implement the route to get products by category
router.get("/category/:id", async (req, res) => {
  try {
    const categoryID = parseInt(req.params.id);
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    console.log("Category ID:", categoryID);
    console.log("Limit:", limit);
    console.log("Offset:", offset);

    const [result, totalCount] = await Promise.all([
      category.getProductByCategory(categoryID, limit, offset),
      category.getTotalProductCount(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Product list.",
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
      message: "Error retrieving products.",
      error: error.message,
    });
  }
});

router.use(express.json());

module.exports = router;
