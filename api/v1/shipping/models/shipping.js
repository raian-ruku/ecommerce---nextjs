// models/shippingAddress.js

const connection = require("../../connection/connection");
const queries = require("../queries/shipping");

const shippingAddresses = {
  getAddresses: async (userId) => {
    try {
      const [addresses] = await connection.query(queries.getAddresses, [
        userId,
      ]);
      return addresses;
    } catch (error) {
      console.error("Get addresses error:", error);
      throw error;
    }
  },

  addAddress: async (userId, addressData) => {
    try {
      const {
        shipping_street,
        shipping_city,
        shipping_state,
        shipping_zip,
        shipping_country,
        is_default,
      } = addressData;
      const [result] = await connection.query(queries.addAddress, [
        userId,
        shipping_street,
        shipping_city,
        shipping_state,
        shipping_zip,
        shipping_country,
        is_default ? 1 : 0,
      ]);
      return result.insertId;
    } catch (error) {
      console.error("Add address error:", error);
      throw error;
    }
  },

  updateAddress: async (userId, addressId, addressData) => {
    try {
      const {
        shipping_street,
        shipping_city,
        shipping_state,
        shipping_zip,
        shipping_country,
      } = addressData;
      const [result] = await connection.query(queries.updateAddress, [
        shipping_street,
        shipping_city,
        shipping_state,
        shipping_zip,
        shipping_country,
        addressId,
        userId,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Update address error:", error);
      throw error;
    }
  },

  deleteAddress: async (userId, addressId) => {
    try {
      const [result] = await connection.query(queries.deleteAddress, [
        addressId,
        userId,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Delete address error:", error);
      throw error;
    }
  },

  setDefaultAddress: async (userId, addressId) => {
    try {
      const [result] = await connection.query(queries.setDefaultAddress, [
        addressId,
        userId,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Set default address error:", error);
      throw error;
    }
  },

  getAddressById: async (userId, addressId) => {
    try {
      const [addresses] = await connection.query(queries.getAddressById, [
        addressId,
        userId,
      ]);
      return addresses[0] || null;
    } catch (error) {
      console.error("Get address by ID error:", error);
      throw error;
    }
  },
};

module.exports = shippingAddresses;
