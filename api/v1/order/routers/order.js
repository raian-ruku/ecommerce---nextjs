const express = require("express");
const router = express.Router();
const orders = require("../models/order");
const { verifyToken } = require("../../jwt");
const isEmpty = require("is-empty");

// Middleware to check if the user is authenticated
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

// Create a new order
router.post("/create-order", authenticateUser, async (req, res) => {
  const { shipping_id, total_price, orderItems } = req.body;
  const user_id = req.user.id;

  if (isEmpty(shipping_id) || isEmpty(total_price) || isEmpty(orderItems)) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const orderId = await orders.createOrder(
      user_id,
      shipping_id,
      total_price,
      orderItems,
    );
    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: { order_id: orderId },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating order.",
      error: error.message,
    });
  }
});

// Get order by ID
router.get("/orders/:orderId", authenticateUser, async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await orders.getOrderById(orderId);
    if (order) {
      if (order.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view this order.",
        });
      }
      return res.status(200).json({
        success: true,
        data: order,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching order.",
      error: error.message,
    });
  }
});

// Get all orders for a user
router.get("/user/all-orders", authenticateUser, async (req, res) => {
  try {
    const userOrders = await orders.getOrdersByUserId(req.user.id);
    return res.status(200).json({
      success: true,
      data: userOrders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user orders.",
      error: error.message,
    });
  }
});

// Update order status
router.put("/:orderId/status", authenticateUser, async (req, res) => {
  const orderId = req.params.orderId;
  const { new_status } = req.body;

  if (isEmpty(new_status)) {
    return res.status(400).json({
      success: false,
      message: "New status is required.",
    });
  }

  try {
    const order = await orders.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this order.",
      });
    }

    const updated = await orders.updateOrderStatus(orderId, new_status);
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
router.delete("/:orderId", authenticateUser, async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await orders.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this order.",
      });
    }

    const deleted = await orders.deleteOrder(orderId);
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
