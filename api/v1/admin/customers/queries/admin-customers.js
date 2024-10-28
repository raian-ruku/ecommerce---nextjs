const users_table = "users";

const queries = {
  getAllCustomers: `SELECT user_id, user_name, user_email, user_image, creation_date from ${users_table}  ORDER BY user_id LIMIT ? OFFSET ?`,
  getTotalCustomerCount: `
    SELECT COUNT(*) AS total FROM ${users_table}
  `,
  searchCustomers: `
    SELECT 
      user_id, user_name, user_email, creation_date
    FROM ${users_table}
    WHERE user_id LIKE ? OR user_name LIKE ? OR user_email LIKE ? 
    LIMIT ? OFFSET ?
  `,
  getTotalSearchCustomerCount: `
    SELECT COUNT(*) as total 
    FROM ${users_table} 
    WHERE user_id LIKE ? OR user_name LIKE ? OR user_email LIKE ?`,
  getCustomerShippingAddresses: `
    SELECT 
      shipping_id, shipping_street, shipping_state, shipping_city,  shipping_zip, shipping_country
    FROM shipping_address
    WHERE user_id = ?
  `,
};

module.exports = queries;
