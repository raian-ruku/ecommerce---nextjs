const connection = require("../../connection/connection");
const queries = require("../queries/password");
const bcrypt = require("bcrypt");

const password = {
  changePassword: async (userId, currentPassword, newPassword) => {
    try {
      // First, get the current hashed password
      const [user] = await connection.query(queries.getUserById, [userId]);
      if (user.length === 0) {
        throw new Error("User not found");
      }

      // Compare the current password
      const isMatch = await bcrypt.compare(
        currentPassword,
        user[0].user_password,
      );
      if (!isMatch) {
        throw new Error("Current password is incorrect");
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update the password
      await connection.query(queries.updatePassword, [hashedPassword, userId]);
      return true;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },
};

module.exports = password;
