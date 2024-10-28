const connection = require("../../../connection/connection");
const queries = require("../queries/admin-sales");

const admin_sales = {
  getCompletedOrders: async (page, pageSize) => {
    try {
      const offset = (page - 1) * pageSize;
      const [orders] = await connection.query(queries.getCompletedOrders, [
        pageSize,
        offset,
      ]);
      return orders;
    } catch (error) {
      console.error("Get completed orders error:", error);
      throw error;
    }
  },

  getOrderItems: async (orderId) => {
    try {
      const [items] = await connection.query(queries.getOrderItems, [orderId]);
      return items;
    } catch (error) {
      console.error("Get order items error:", error);
      throw error;
    }
  },

  addSale: async (orderId, orderItems) => {
    const conn = await connection.getConnection();
    try {
      await conn.beginTransaction();

      for (const item of orderItems) {
        await conn.query(queries.addSale, [
          orderId,
          item.product_id,
          item.quantity,
          item.price,
        ]);

        await conn.query(queries.updateProductStock, [
          item.quantity,
          item.product_id,
        ]);
      }

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      console.error("Add sale error:", error);
      throw error;
    } finally {
      conn.release();
    }
  },

  getAllSales: async (page, pageSize, searchTerm) => {
    try {
      const offset = (page - 1) * pageSize;
      let sales, totalCount;

      if (searchTerm) {
        const searchPattern = `%${searchTerm}%`;
        [sales] = await connection.query(queries.searchSales, [
          searchPattern,
          searchPattern,
          pageSize,
          offset,
        ]);
        [[{ total }]] = await connection.query(
          queries.getTotalSearchSalesCount,
          [searchPattern,searchPattern],
        );
      } else {
        [sales] = await connection.query(queries.getAllSales, [
          pageSize,
          offset,
        ]);
        [[{ total }]] = await connection.query(queries.getTotalSalesCount);
      }

      return {
        sales,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      console.error("Get sales error:", error);
      throw error;
    }
  },

  getSaleDetails: async (orderId) => {
    try {
      const [details] = await connection.query(queries.getSaleDetails, [
        orderId,
      ]);
      return details;
    } catch (error) {
      console.error("Get sale details error:", error);
      throw error;
    }
  },
};

module.exports = admin_sales;
