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

module.exports = router;
