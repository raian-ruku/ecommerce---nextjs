const connection = require("../../connection/connection");
const queries = require("../queries/categories");

let getList = async () => {
  try {
    // Use await to resolve the query promise
    const [rows] = await connection.query(queries.getList());
    return rows; // This will return the result of the query
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { getList };
