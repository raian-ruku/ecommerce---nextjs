const table_name = "admin_user";

const queries = {
  createAccount: `INSERT INTO ${table_name} ( admin_email, admin_password, admin_username, admin_name, role) VALUES (?,?, ?, ?, "admin")`,
  getUserById: `SELECT admin_id, admin_name, admin_email FROM ${table_name} WHERE admin_id = ?`,
  loginByEmailorUsername: `SELECT admin_id, admin_name, admin_email, admin_username, admin_password, role FROM ${table_name} WHERE admin_email LIKE ? OR admin_username LIKE ?`,
  existingCheck: `SELECT admin_id FROM ${table_name} WHERE admin_email = ?`,
};

module.exports = queries;
