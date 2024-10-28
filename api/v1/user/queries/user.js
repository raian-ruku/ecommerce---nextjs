const table_name = "users";

const queries = {
  createAccount: `INSERT INTO ${table_name} (user_name, user_email, user_password) VALUES (?, ?, ?)`,
  getUserById: `SELECT user_id, user_name, user_email, user_image FROM ${table_name} WHERE user_id = ?`,
  loginByEmail: `SELECT user_id, user_name, user_email, user_password FROM ${table_name} WHERE user_email = ?`,
  existingCheck: `SELECT user_id FROM ${table_name} WHERE user_email = ?`,
};

module.exports = queries;
