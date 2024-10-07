const bcrypt = require("bcrypt");
const connection = require("../../../connection/connection");
const queries = require("../queries/admin-user");

const users = {
  createAccount: async (
    user_email,
    user_password,
    user_username,
    user_name,
  ) => {
    try {
      const hashedPassword = await bcrypt.hash(user_password, 10);

      // Insert user into the database
      const [insertResult] = await connection.query(queries.createAccount, [
        user_email,
        hashedPassword,
        user_username,
        user_name,
      ]);

      // Get the inserted user's ID
      const insertedUserId = insertResult.insertId;

      // Fetch the newly inserted user's data using the ID
      const [userData] = await connection.query(queries.getUserById, [
        insertedUserId,
      ]);

      // Return the fetched user data
      return userData[0]; // Return first (and only) user from result set
    } catch (error) {
      console.error("Create account error:", error);
      throw error;
    }
  },
  loginByEmailorUsername: async (user_login, user_password) => {
    try {
      // Fetch user from the database
      const [userData] = await connection.query(
        queries.loginByEmailorUsername,
        [user_login, user_login],
      );

      // Check if user exists
      if (userData.length === 0) {
        return null; // User not found
      }

      const user = userData[0];

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(
        user_password,
        user.admin_password,
      );

      if (isPasswordValid) {
        // Remove password from user data before returning
        const { user_password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      } else {
        return null; // Invalid password
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  existingCheck: async (user_email) => {
    try {
      // Fetch user from the database
      const [userData] = await connection.query(queries.existingCheck, [
        user_email,
      ]);

      // Check if user exists
      if (userData.length === 0) {
        return false; // User does not exist
      } else {
        return true; // User exists
      }
    } catch (error) {
      console.error("Email check error:", error);
      throw error;
    }
  },
};

module.exports = users;
