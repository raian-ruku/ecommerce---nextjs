const table_name = "category";

const queries = {
  getList: `SELECT category_id, category_name FROM ${table_name}`,
  getProductByCategory: `
    SELECT p.product_id, PM.product_stock, p.product_minimum, p.product_title, p.product_thumbnail, p.product_brand, PM.product_price, c.category_name
    FROM products AS p
    INNER JOIN products_master AS PM ON p.product_id = PM.product_id 
    INNER JOIN category AS c ON p.category_id = c.category_id 
    WHERE c.category_name = ? AND PM.product_price BETWEEN ? AND ?
    ORDER BY PM.product_price ASC
    LIMIT ? OFFSET ?
  `,
  getTotalProductCountByCategory: `
    SELECT COUNT(*) AS total 
    FROM products AS p
    INNER JOIN category AS c ON p.category_id = c.category_id
    INNER JOIN products_master AS PM ON p.product_id = PM.product_id
    WHERE c.category_name = ? AND PM.product_price BETWEEN ? AND ?
  `,
  getPriceRangeByCategory: `
    SELECT MIN(PM.product_price) AS min_price, MAX(PM.product_price) AS max_price
    FROM products AS p
    INNER JOIN products_master AS PM ON p.product_id = PM.product_id
    INNER JOIN category AS c ON p.category_id = c.category_id
    WHERE c.category_name = ?
  `,
  getOverallPriceRange: `
    SELECT MIN(product_price) AS min_price, MAX(product_price) AS max_price
    FROM products_master
  `,
};

module.exports = queries;