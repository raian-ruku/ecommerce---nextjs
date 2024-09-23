const connection = require("../../connection/connection");
const queries = require("../queries/categories");

const categories = {
  getList: async () => {
    try {
      const [rows] = await connection.query(queries.getList);
      return rows;
    } catch (error) {
      throw new Error(error);
    }
  },
  getProductByCategory: async (
    categoryName,
    limit,
    offset,
    minPrice,
    maxPrice,
  ) => {
    try {
      const [rows] = await connection.query(queries.getProductByCategory, [
        categoryName,
        minPrice,
        maxPrice,
        limit,
        offset,
      ]);
      return rows;
    } catch (error) {
      throw new Error(error);
    }
  },

  getTotalProductCountByCategory: async (categoryName, minPrice, maxPrice) => {
    try {
      const [results] = await connection.query(
        queries.getTotalProductCountByCategory,
        [categoryName, minPrice, maxPrice],
      );
      return results[0].total;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = categories;
