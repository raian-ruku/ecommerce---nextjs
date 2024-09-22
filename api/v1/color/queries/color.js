const table_name = "colors";

const queries = {
  getColors: `
        SELECT * FROM ${table_name}
    `,

  setColors: ` UPDATE ${table_name} SET color = ? WHERE color_id = ?`,
};

module.exports = queries;
