const express = require("express");
const router = express.Router();
const admin_products = require("../models/admin-products");
const { verifyToken } = require("../../../jwt");
const isEmpty = require("is-empty");

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }
  try {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

router.get("/admin/all-products", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this page.",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchTerm = req.query.search || "";

    const result = await admin_products.getAllProducts(
      page,
      pageSize,
      searchTerm,
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching products.",
      error: error.message,
    });
  }
});

router.post("/admin/add-product", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action.",
      });
    }

    const productData = req.body;
    const productId = await admin_products.addProduct(productData);

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      productId: productId,
    });
  } catch (error) {
    console.error("Error in add product route:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding product.",
      error: error.message,
    });
  }
});

router.get("/admin/product/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this information.",
      });
    }
    const product = await admin_products.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching product.",
      error: error.message,
    });
  }
});

router.put("/admin/product/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action.",
      });
    }
    await admin_products.updateProduct(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating product.",
      error: error.message,
    });
  }
});

router.delete("/admin/product/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action.",
      });
    }
    await admin_products.deleteProduct(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting product.",
      error: error.message,
    });
  }
});

router.get("/admin/categories", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this information.",
      });
    }
    const categories = await admin_products.getAllCategories();
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching categories.",
      error: error.message,
    });
  }
});

module.exports = router;
