// models/order.js
const connection = require("../../connection/connection");
const queries = require("../queries/order");

const orders = {
  createOrder: async (product_id, user_id, shipping_id, quantity) => {
    try {
      const [result] = await connection.query(queries.createOrder, [
        product_id,
        user_id,
        shipping_id,
        quantity,
      ]);
      return result.insertId;
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  },

  getOrderById: async (order_id) => {
    try {
      const [orderData] = await connection.query(queries.getOrderById, [
        order_id,
      ]);
      return orderData[0] || null;
    } catch (error) {
      console.error("Get order details error:", error);
      throw error;
    }
  },

  getOrdersByUserId: async (user_id) => {
    try {
      const [ordersData] = await connection.query(queries.getOrdersByUserId, [
        user_id,
      ]);
      return ordersData;
    } catch (error) {
      console.error("Get user orders error:", error);
      throw error;
    }
  },

  updateOrderStatus: async (order_id, new_status) => {
    try {
      const [result] = await connection.query(queries.updateOrderStatus, [
        new_status,
        order_id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Update order status error:", error);
      throw error;
    }
  },

  deleteOrder: async (order_id) => {
    try {
      const [result] = await connection.query(queries.deleteOrder, [order_id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Delete order error:", error);
      throw error;
    }
  },
};

module.exports = orders;
