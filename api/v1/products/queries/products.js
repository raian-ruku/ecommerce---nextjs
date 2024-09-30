const isEmpty = require("is-empty");
const table_name = "products";

const queries = {
  getProducts: `
    SELECT p.product_id, p.product_availability, p.product_title, p.product_thumbnail, p.product_brand, PM.product_price 
    FROM ${table_name} AS p
    INNER JOIN products_master AS PM ON p.product_id = PM.product_id 
    INNER JOIN category AS c ON p.category_id = c.category_id
    WHERE PM.product_price BETWEEN ? AND ?
    ORDER BY PM.product_price ASC
    LIMIT ? OFFSET ?
    `,
  getTotalProductCount: `SELECT COUNT(*) AS total 
    FROM ${table_name} AS p
    INNER JOIN products_master AS PM ON p.product_id = PM.product_id 
    INNER JOIN category AS c ON p.category_id = c.category_id
    WHERE PM.product_price BETWEEN ? AND ?`,

  getProduct: `
        SELECT p.product_id, p.product_availability, p.product_title, p.product_description, p.product_thumbnail, p.product_brand, p.product_rating,  PM.product_price, p.product_return, p.product_shipping, p.product_warranty, PM.product_stock, p.product_weight, p.product_minimum, c.category_name
        FROM ${table_name} AS p
        INNER JOIN products_master AS PM ON p.product_id = PM.product_id 
        INNER JOIN category AS c ON p.category_id = c.category_id 
        WHERE p.product_id = ?
    `,

  getImages: `
        SELECT image_id, image_data FROM images WHERE product_id = ?
    `,

  getReviews: `
        SELECT review_id, review_rating, review_comment FROM reviews WHERE product_id = ?
    `,
  getDimensions: `
        SELECT height, width, depth FROM dimensions WHERE product_id = ?
    `,
  getBestSeller: `
        SELECT p.product_id, p.product_availability, p.product_title, p.product_thumbnail, p.product_brand, PM.product_price
        FROM ${table_name} AS p
        INNER JOIN products_master AS PM ON p.product_id = PM.product_id 
        ORDER BY p.product_rating DESC
        LIMIT 10 OFFSET 10
    `,
  getTotalProductCount: `SELECT COUNT(*) AS total FROM ${table_name}`,

  searchProducts: `
    SELECT p.product_id, p.product_availability, p.product_title, p.product_thumbnail, p.product_brand, PM.product_price 
    FROM ${table_name} AS p
    INNER JOIN products_master AS PM ON p.product_id = PM.product_id 
    INNER JOIN category AS c ON p.category_id = c.category_id
    WHERE p.product_title LIKE ? OR p.product_brand LIKE ? OR c.category_name LIKE ?
    ORDER BY PM.product_price ASC
    LIMIT ? OFFSET ?
  `,
};

module.exports = queries;
