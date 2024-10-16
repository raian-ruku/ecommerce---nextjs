const express = require("express");
const router = express.Router();
const admin_orders = require("../models/admin-orders");
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

router.get("/admin/orders", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const { orders, totalCount } = await admin_orders.getAllOrders(
      page,
      pageSize,
    );
    return res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching orders.",
      error: error.message,
    });
  }
});

// Update order status
router.put("/admin/status/:orderId", authenticateUser, async (req, res) => {
  const orderId = req.params.orderId;
  const { new_status } = req.body;

  if (isEmpty(new_status)) {
    return res.status(400).json({
      success: false,
      message: "New status is required.",
    });
  }

  try {
    const order = await admin_orders.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this order.",
      });
    }

    const updated = await admin_orders.updateOrderStatus(orderId, new_status);
    if (updated) {
      return res.status(200).json({
        success: true,
        message: "Order status updated successfully.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to update order status.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating order status.",
      error: error.message,
    });
  }
});

// Delete an order
router.delete("/admin/delete/:orderId", authenticateUser, async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await admin_orders.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this order.",
      });
    }

    const deleted = await admin_orders.deleteOrder(orderId);
    if (deleted) {
      return res.status(200).json({
        success: true,
        message: "Order deleted successfully.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to delete order.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting order.",
      error: error.message,
    });
  }
});

module.exports = router;
