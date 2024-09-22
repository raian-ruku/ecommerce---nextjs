const connection = require("../../connection/connection");
const queries = require("../queries/products");

const products = {
  getProducts: async (limit, offset) => {
    try {
      const [results] = await connection.query(queries.getProducts, [
        limit,
        offset,
      ]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getBestSeller: async (limit, offset) => {
    try {
      const [results] = await connection.query(queries.getBestSeller, [
        limit,
        offset,
      ]);
      return results;
    } catch (error) {
      throw error;
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

  getProduct: async (id) => {
    try {
      const [results] = await connection.query(queries.getProduct, [id]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getImages: async (id) => {
    try {
      const [results] = await connection.query(queries.getImages, [id]);
      return results;
    } catch (error) {
      throw error;
    }
  },
  getReviews: async (id) => {
    try {
      const [results] = await connection.query(queries.getReviews, [id]);
      return results;
    } catch (error) {
      throw error;
    }
  },
  getDimensions: async (id) => {
    try {
      const [results] = await connection.query(queries.getDimensions, [id]);
      return results;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = products;
