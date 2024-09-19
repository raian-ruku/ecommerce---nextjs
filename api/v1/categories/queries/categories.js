let table_name = "category";

let getList = () => {
  return `SELECT category_id, category_name FROM ${table_name}`;
};

module.exports = { getList };
