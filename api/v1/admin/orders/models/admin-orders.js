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
};

module.exports = admin_orders;
