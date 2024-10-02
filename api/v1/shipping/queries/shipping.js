// queries/shippingAddress.js

const table_name = "shipping_address";

const queries = {
  getAddresses: `SELECT * FROM ${table_name} WHERE user_id = ?`,
  addAddress: `INSERT INTO ${table_name} (user_id, shipping_street, shipping_city, shipping_state, shipping_zip, shipping_country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  updateAddress: `UPDATE ${table_name} SET shipping_street = ?, shipping_city = ?, shipping_state = ?, shipping_zip = ?, shipping_country = ? WHERE shipping_id = ? AND user_id = ?`,
  deleteAddress: `DELETE FROM ${table_name} WHERE shipping_id = ? AND user_id = ?`,
  setDefaultAddress: `UPDATE ${table_name} SET is_default = CASE WHEN shipping_id = ? THEN 1 ELSE 0 END WHERE user_id = ?`,
  getAddressById: `SELECT * FROM ${table_name} WHERE shipping_id = ? AND user_id = ?`,
};

module.exports = queries;
