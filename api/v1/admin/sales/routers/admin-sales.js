const express = require("express");
const router = express.Router();
const admin_sales = require("../models/admin-sales");
const { verifyToken } = require("../../../jwt");

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

router.get("/admin/completed-orders", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this information.",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const orders = await admin_sales.getCompletedOrders(page, pageSize);
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching completed orders.",
      error: error.message,
    });
  }
});

router.get(
  "/admin/order-items/:orderId",
  authenticateUser,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this information.",
        });
      }

      const orderId = req.params.orderId;
      const items = await admin_sales.getOrderItems(orderId);
      return res.status(200).json({ success: true, items });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching order items.",
        error: error.message,
      });
    }
  },
);

router.post("/admin/add-sale", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action.",
      });
    }

    const { orderId, orderItems } = req.body;
    await admin_sales.addSale(orderId, orderItems);
    return res.status(201).json({
      success: true,
      message: "Sale added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding sale.",
      error: error.message,
    });
  }
});

router.get("/admin/sales", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this information.",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchTerm = req.query.search || "";

    const result = await admin_sales.getAllSales(page, pageSize, searchTerm);
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching sales.",
      error: error.message,
    });
  }
});

router.get("/admin/sale/:orderId", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this information.",
      });
    }

    const orderId = req.params.orderId;
    const saleDetails = await admin_sales.getSaleDetails(orderId);
    return res.status(200).json({
      success: true,
      saleDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching sale details.",
      error: error.message,
    });
  }
});

module.exports = router;
