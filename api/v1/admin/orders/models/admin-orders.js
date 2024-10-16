const connection = require("../../../connection/connection");
const queries = require("../queries/admin-orders");

const admin_orders = {
  getOrderSales: async () => {
    try {
      const [orderSales] = await connection.query(queries.getOrderSales);
      return orderSales;
    } catch (error) {
      console.error("Get order sales error:", error);
      throw error;
    }
  },
  getOrderDates: async () => {
    try {
      const [orderDates] = await connection.query(queries.getOrderDates);
      return orderDates;
    } catch (error) {
      console.error("Get order dates error:", error);
      throw error;
    }
  },
  getMonthlyGoal: async () => {
    try {
      const [monthlyGoal] = await connection.query(queries.getMonthlyGoal);
      return monthlyGoal;
    } catch (error) {
      console.error("Get order dates error:", error);
      throw error;
    }
  },
  getTopProducts: async () => {
    try {
      const [topProducts] = await connection.query(queries.getTopProducts);
      return topProducts;
    } catch (error) {
      console.error("Get top products error:", error);
      throw error;
    }
  },
  getPendingOrders: async () => {
    try {
      const [pendingProducts] = await connection.query(
        queries.getPendingOrders,
      );
      return pendingProducts;
    } catch (error) {
      console.error("Get top products error:", error);
      throw error;
    }
  },
  getAllOrders: async (page, pageSize) => {
    try {
      const offset = (page - 1) * pageSize;
      const [orders] = await connection.query(queries.getAllOrders, [
        pageSize,
        offset,
      ]);
      const [totalCount] = await connection.query(queries.getTotalOrderCount);
      return {
        orders,
        totalCount: totalCount[0].total,
      };
    } catch (error) {
      console.error("Get all orders error:", error);
      throw error;
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
    const conn = await connection.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(queries.deleteOrderItems, [order_id]);
      const [result] = await conn.query(queries.deleteOrder, [order_id]);

      await conn.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await conn.rollback();
      console.error("Delete order error:", error);
      throw error;
    } finally {
      conn.release();
    }
  },
};

module.exports = admin_orders;
