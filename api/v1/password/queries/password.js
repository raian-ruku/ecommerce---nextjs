const users_table = "users";

const queries = {
  getUserById: `
    SELECT user_id, user_password
    FROM ${users_table}
    WHERE user_id = ?
  `,

  updatePassword: `
    UPDATE ${users_table}
    SET user_password = ?
    WHERE user_id = ?
  `,
};

module.exports = queries;
