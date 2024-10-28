const connection = require("../../../connection/connection");
const queries = require("../queries/admin-settings");

const admin_settings = {
  getMonthlyGoal: async () => {
    try {
      const [monthlyGoal] = await connection.query(queries.getMonthlyGoal);
      return monthlyGoal;
    } catch (error) {
      console.error("Get order dates error:", error);
      throw error;
    }
  },
  updateMonthlyGoal: async (monthly_goal) => {
    try {
      const [result] = await connection.query(queries.updateMonthlyGoal, [
        monthly_goal,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Update monthly goal error:", error);
      throw error;
    }
  },
};

module.exports = admin_settings;
