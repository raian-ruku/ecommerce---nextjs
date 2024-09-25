const table_name = "users";

const queries = {
  createAccount: `INSERT INTO ${table_name} (user_name, user_email, user_password) VALUES (?, ?, ?)`,
  getUserById: `SELECT user_id, user_name, user_email FROM ${table_name} WHERE user_id = ?`,
};

module.exports = queries;
