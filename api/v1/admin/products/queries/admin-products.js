const products_table = "products";

const queries = {
  getAllProducts: `
    SELECT 
      p.product_id, p.product_title, p.product_sku, p.product_thumbnail, 
      p.creation_date, c.category_name, pm.purchase_price, 
      pm.product_price, pm.product_stock 
    FROM ${products_table} p 
    JOIN products_master pm ON p.product_id = pm.product_id 
    JOIN category c ON p.category_id = c.category_id
    LIMIT ? OFFSET ?
  `,
  getTotalProductCount: `
    SELECT COUNT(*) as total 
    FROM ${products_table}
  `,
  searchProducts: `
    SELECT 
      p.product_id, p.product_title, p.product_sku, p.product_thumbnail, 
      p.creation_date, c.category_name, pm.purchase_price, 
      pm.product_price, pm.product_stock 
    FROM ${products_table} p 
    JOIN products_master pm ON p.product_id = pm.product_id 
    JOIN category c ON p.category_id = c.category_id
    WHERE p.product_title LIKE ?
    LIMIT ? OFFSET ?
  `,
  getTotalSearchProductCount: `
    SELECT COUNT(*) as total 
    FROM ${products_table} p
    WHERE p.product_title LIKE ?
  `,
};

module.exports = queries;