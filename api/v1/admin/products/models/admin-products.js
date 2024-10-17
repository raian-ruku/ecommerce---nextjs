const connection = require("../../../connection/connection");
const queries = require("../queries/admin-products");

const admin_products = {
  getAllProducts: async (page, pageSize, searchTerm) => {
    try {
      const offset = (page - 1) * pageSize;
      let products, totalCount;

      if (searchTerm) {
        const searchPattern = `%${searchTerm}%`;
        [products] = await connection.query(queries.searchProducts, [
          searchPattern,
          pageSize,
          offset,
        ]);
        [[{ total }]] = await connection.query(
          queries.getTotalSearchProductCount,
          [searchPattern],
        );
      } else {
        [products] = await connection.query(queries.getAllProducts, [
          pageSize,
          offset,
        ]);
        [[{ total }]] = await connection.query(queries.getTotalProductCount);
      }

      return {
        products,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      console.error("Get products error:", error);
      throw error;
    }
  },
};

module.exports = admin_products;
