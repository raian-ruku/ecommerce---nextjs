const connection = require("../../connection/connection");
const queries = require("../queries/color");

const colors = {
  getColors: async () => {
    try {
      const [results] = await connection.query(queries.getColors);
      return results;
    } catch (error) {
      throw error;
    }
  },
  setColors: async (color, id) => {
    try {
      const [results] = await connection.query(queries.setColors, [color, id]);
      return results;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = colors;
