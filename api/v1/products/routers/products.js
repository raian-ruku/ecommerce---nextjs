const express = require("express");
const router = express.Router();
const products = require("../models/products");

router.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const [result, totalCount] = await Promise.all([
      products.getProducts(limit, offset),
      products.getTotalProductCount(),
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

router.get("/products/:id", async (req, res) => {
  let result = await products.getProduct(req.params.id);
  for (let i = 0; i < result.length; i++) {
    let images = await products.getImages(result[i].product_id);
    result[i].images = images;
  }
  for (let i = 0; i < result.length; i++) {
    let reviews = await products.getReviews(result[i].product_id);
    result[i].review = reviews;
  }
  for (let i = 0; i < result.length; i++) {
    let dimensions = await products.getDimensions(result[i].product_id);
    result[i].dimension = dimensions;
  }
  return res.status(200).send({
    success: true,
    status: 200,
    message: "Product details.",
    data: result,
  });
});

router.get("/bestseller", async (req, res) => {
  try {
    const [result] = await Promise.all([products.getBestSeller()]);

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Product list.",
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
