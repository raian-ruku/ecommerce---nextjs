const bcrypt = require("bcrypt");
const connection = require("../../connection/connection");
const queries = require("../queries/user");

const users = {
  createAccount: async (user_name, user_email, user_password) => {
    try {
      const hashedPassword = await bcrypt.hash(user_password, 10);

      // Insert user into the database
      const [insertResult] = await connection.query(queries.createAccount, [
        user_name,
        user_email,
        hashedPassword,
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
};

module.exports = users;
