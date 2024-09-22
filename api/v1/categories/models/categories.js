const connection = require("../../connection/connection");
const { getProduct } = require("../../products/queries/products");
const queries = require("../queries/categories");

const categories = {
  getList: async () => {
    try {
      // Use await to resolve the query promise
      const [rows] = await connection.query(queries.getList);
      return rows; // This will return the result of the query
    } catch (error) {
      throw new Error(error);
    }
  },
  //TODO Implement the function to get products by category
  getProductByCategory: async (limit, offset) => {
    try {
      const [rows] = await connection.query(queries.getProductCategories, [
        limit,
        offset,
      ]);
      return rows;
    } catch (error) {
      throw new Error(error);
    }
  },
  getTotalProductCount: async () => {
    try {
      const [results] = await connection.query(queries.getTotalProductCount);
      return results[0].total;
    } catch (error) {
      throw error;
    }
  },
};
module.exports = categories;
