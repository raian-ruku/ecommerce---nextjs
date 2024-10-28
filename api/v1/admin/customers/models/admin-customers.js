const connection = require("../../../connection/connection");
const queries = require("../queries/admin-customers");

const admin_customers = {
  getAllCustomers: async (page, pageSize, searchTerm) => {
    try {
      const offset = (page - 1) * pageSize;
      let customers, totalCount;

      if (searchTerm) {
        const searchPattern = `%${searchTerm}%`;
        [customers] = await connection.query(queries.searchCustomers, [
          searchPattern,
          searchPattern,
          searchPattern,
          pageSize,
          offset,
        ]);
        [[{ total }]] = await connection.query(
          queries.getTotalSearchCustomerCount,
          [searchPattern, searchPattern, searchPattern],
        );
      } else {
        [customers] = await connection.query(queries.getAllCustomers, [
          pageSize,
          offset,
        ]);
        [[{ total }]] = await connection.query(queries.getTotalCustomerCount);
      }

      return {
        customers,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      console.error("Get customers error:", error);
      throw error;
    }
  },
  getCustomerShippingAddresses: async (userId) => {
    try {
      const [addresses] = await connection.query(
        queries.getCustomerShippingAddresses,
        [userId],
      );
      return addresses;
    } catch (error) {
      console.error("Get customer shipping addresses error:", error);
      throw error;
    }
  },
};

module.exports = admin_customers;
