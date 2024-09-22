let table_name = "category";

const queries = {
  getList: `SELECT category_id, category_name FROM ${table_name}`,
  //TODO Implement the query to get products by category
  getProductByCategory: `
        SELECT p.product_id, p.product_availability, p.product_title, p.product_thumbnail, p.product_brand, PM.product_price 
        FROM products AS p
        INNER JOIN products_master AS PM ON p.product_id = PM.product_id 
        WHERE p.category_id = ?
        ORDER BY PM.product_price ASC
        LIMIT ? OFFSET ? 
    `,
  getTotalProductCount: `SELECT COUNT(*) AS total FROM products`,
};
module.exports = queries;
