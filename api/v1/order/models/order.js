const connection = require("../../connection/connection");
const queries = require("../queries/order");

const orders = {
  createOrder: async (user_id, shipping_id, total_price, orderItems) => {
    const conn = await connection.getConnection();
    try {
      await conn.beginTransaction();

      const [orderResult] = await conn.query(queries.createOrder, [
        user_id,
        shipping_id,
        total_price,
      ]);
      const orderId = orderResult.insertId;

      for (const item of orderItems) {
        await conn.query(queries.createOrderItem, [
          orderId,
          item.id,
          item.quantity,
          item.price * item.quantity,
          item.shipping_cost,
          item.tax,
        ]);
      }

      await conn.commit();
      return orderId;
    } catch (error) {
      await conn.rollback();
      console.error("Create order error:", error);
      throw error;
    } finally {
      conn.release();
    }
  },

  getOrderById: async (order_id) => {
    try {
      const [orderData] = await connection.query(queries.getOrderById, [
        order_id,
      ]);
      if (orderData.length === 0) return null;

      const [orderItems] = await connection.query(queries.getOrderById, [
        order_id,
      ]);

      return {
        ...orderData[0],
        items: orderItems,
      };
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
};

module.exports = orders;
