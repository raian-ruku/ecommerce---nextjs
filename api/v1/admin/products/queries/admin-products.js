const products_table = "products";
const products_master_table = "products_master";
const category_table = "category";
const dimensions_table = "dimensions";
const images_table = "images";

const queries = {
  getAllProducts: `
    SELECT 
      p.product_id, p.product_title, p.product_sku, p.product_thumbnail, 
      p.creation_date, c.category_name, c.category_id, pm.purchase_price, 
      pm.product_price, pm.product_stock, d.dimensions_id, d.height, d.width, d.depth 
    FROM ${products_table} p 
    JOIN ${products_master_table} pm ON p.product_id = pm.product_id 
    JOIN ${category_table} c ON p.category_id = c.category_id
    LEFT JOIN ${dimensions_table} d ON p.product_id = d.product_id
    order by p.product_id
    LIMIT ? OFFSET ?
  `,
  getTotalProductCount: `
    SELECT COUNT(*) as total 
    FROM ${products_table}
  `,
  searchProducts: `
    SELECT 
      p.product_id, p.product_title, p.product_sku, p.product_thumbnail, 
      p.creation_date, c.category_name, c.category_id, pm.purchase_price, 
      pm.product_price, pm.product_stock, d.dimensions_id, d.height, d.width, d.depth 
    FROM ${products_table} p 
    JOIN ${products_master_table} pm ON p.product_id = pm.product_id 
    JOIN ${category_table} c ON p.category_id = c.category_id
    LEFT JOIN ${dimensions_table} d ON p.product_id = d.product_id
    WHERE p.product_title LIKE ? OR p.product_id LIKE ? OR p.product_sku LIKE ? OR c.category_name LIKE ?
    LIMIT ? OFFSET ?
  `,
  getTotalSearchProductCount: `
    SELECT COUNT(*) as total 
    FROM ${products_table} p
    JOIN ${category_table} c ON p.category_id = c.category_id
    WHERE p.product_title LIKE ? OR p.product_id LIKE ? OR p.product_sku LIKE ? OR c.category_name LIKE ?
  `,
  getProductById: `
    SELECT 
      p.product_id, p.product_title, p.product_sku, p.product_thumbnail, 
      p.creation_date, c.category_name, c.category_id, pm.purchase_price, 
      pm.product_price, pm.product_stock, d.dimensions_id, d.height, d.width, d.depth, i.image_data 
    FROM ${products_table} p 
    JOIN ${products_master_table} pm ON p.product_id = pm.product_id 
    JOIN ${category_table} c ON p.category_id = c.category_id
    JOIN ${images_table} i ON p.product_id = i.product_id
    LEFT JOIN ${dimensions_table} d ON p.product_id = d.product_id
    WHERE p.product_id = ?
  `,
  addProduct: `
    INSERT INTO ${products_table} (product_title, product_sku, product_thumbnail, category_id, created_by, creation_date, last_updated_by, last_update_date, change_number)
    VALUES (?, ?, ?, ?, 'admin', CURRENT_TIMESTAMP,  'admin', CURRENT_TIMESTAMP, 1)
  `,

  addProductMaster: `
    INSERT INTO ${products_master_table} (product_id, purchase_price, product_price, product_stock, created_by, creation_date, last_updated_by, last_update_date, change_number)
    VALUES (?, ?, ?, ?, 'admin', CURRENT_TIMESTAMP, 'admin', CURRENT_TIMESTAMP, 1)
  `,

  addDimensions: `
    INSERT INTO ${dimensions_table} (product_id, height, width, depth, created_by, creation_date, last_updated_by, last_update_date, change_number)
    VALUES (?, ?, ?, ?, 'admin', CURRENT_TIMESTAMP, 'admin', CURRENT_TIMESTAMP, 1)
  `,

  addProductImage: `
    INSERT INTO ${images_table} (product_id, image_data, created_by, creation_date, last_updated_by, last_update_date, change_number)
    VALUES (?, ?, 'admin', CURRENT_TIMESTAMP, 'admin', CURRENT_TIMESTAMP, 1)
  `,
  updateProduct: `
    UPDATE ${products_table}
    SET product_title = ?, product_sku = ?, product_thumbnail = ?, category_id = ?, 
    last_updated_by = "admin", last_update_date = CURRENT_TIMESTAMP
    WHERE product_id = ?
  `,

  updateProductMaster: `
    UPDATE ${products_master_table}
    SET purchase_price = ?, product_price = ?, product_stock = ?, 
    last_updated_by = "admin", last_update_date = CURRENT_TIMESTAMP
    WHERE product_id = ?
  `,

  updateDimensions: `
    UPDATE ${dimensions_table} 
    SET height = ?, width = ?, depth = ?,
    last_updated_by = "admin", last_update_date = CURRENT_TIMESTAMP 
    WHERE product_id = ?
  `,

  getProductImages: `
    SELECT image_id, image_data 
    FROM ${images_table}
    WHERE product_id = ?
  `,

  deleteProductImage: `
    DELETE FROM ${images_table}
    WHERE image_id = ?
  `,

  getAllCategories: `SELECT category_id, category_name FROM ${category_table}`,
};

module.exports = queries;
