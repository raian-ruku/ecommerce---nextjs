const admin_table = "admin_user";

const queries = {
  getMonthlyGoal: `SELECT monthly_goal FROM ${admin_table} WHERE admin_id = 2`,
  updateMonthlyGoal: `UPDATE ${admin_table} SET monthly_goal = ? WHERE admin_id = 2`,
};

module.exports = queries;
