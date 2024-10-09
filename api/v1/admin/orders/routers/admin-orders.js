const express = require("express");
const router = express.Router();
const admin_orders = require("../models/admin-orders");
const { verifyToken } = require("../../../jwt");
const isEmpty = require("is-empty");

router.get("/admin/order-sales", async (req, res) => {
  try {
    const orderSales = await admin_orders.getOrderSales();
    return res.status(200).json({
      success: true,
      data: orderSales,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching order sales.",
      error: error.message,
    });
  }
});

router.get("/admin/order-dates", async (req, res) => {
  try {
    const orderSales = await admin_orders.getOrderDates();
    return res.status(200).json({
      success: true,
      data: orderSales,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching order dates.",
      error: error.message,
    });
  }
});

router.get("/admin/monthly_goal", async (req, res) => {
  try {
    const monthlyGoal = await admin_orders.getMonthlyGoal();
    return res.status(200).json({
      success: true,
      data: monthlyGoal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching monthly goal.",
      error: error.message,
    });
  }
});

router.get("/admin/top-orders", async (req, res) => {
  try {
    const topProducts = await admin_orders.getTopProducts();
    return res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching top products.",
      error: error.message,
    });
  }
});
router.get("/admin/pending-orders", async (req, res) => {
  try {
    const pendingOrders = await admin_orders.getPendingOrders();
    return res.status(200).json({
      success: true,
      data: pendingOrders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching pending Orders.",
      error: error.message,
    });
  }
});

module.exports = router;
