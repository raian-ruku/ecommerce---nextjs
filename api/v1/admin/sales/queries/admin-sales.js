const orders_table = "orders";
const order_items_table = "order_items";
const products_table = "products";
const products_master_table = "products_master";
const sales_table = "sales";

const queries = {
  getCompletedOrders: `
    SELECT o.order_id, o.total_price, o.order_date, COUNT(oi.order_item_id) as total_items
    FROM ${orders_table} o
    JOIN ${order_items_table} oi ON o.order_id = oi.order_id
    WHERE o.order_status = 3 AND o.order_id NOT IN (SELECT DISTINCT order_id FROM ${sales_table})
    GROUP BY o.order_id
    ORDER BY o.order_date DESC
    LIMIT ? OFFSET ?
  `,

  getOrderItems: `
    SELECT oi.order_item_id, oi.product_id, p.product_title, oi.quantity, oi.price
    FROM ${order_items_table} oi
    JOIN ${products_table} p ON oi.product_id = p.product_id
    WHERE oi.order_id = ?
  `,

  addSale: `
    INSERT INTO ${sales_table} (order_id, product_id, quantity, price, created_by, creation_date, last_updated_by, last_update_date)
    VALUES (?, ?, ?, ?, "admin", CURRENT_TIMESTAMP, "admin", CURRENT_TIMESTAMP)
  `,

  updateProductStock: `
    UPDATE ${products_master_table}
    SET product_stock = product_stock - ?, last_updated_by = "admin", last_update_date = CURRENT_TIMESTAMP
    WHERE product_id = ?
  `,

  getAllSales: `
    SELECT s.order_id, 
           MAX(s.creation_date) as creation_date, 
           SUM(s.quantity) as total_quantity, 
           SUM(s.price) as price,
           COUNT(DISTINCT s.product_id) as total_products
    FROM ${sales_table} s
    GROUP BY s.order_id
    ORDER BY MAX(s.creation_date) DESC
    LIMIT ? OFFSET ?
  `,

  getTotalSalesCount: `
    SELECT COUNT(DISTINCT order_id) as total FROM ${sales_table}
  `,

  searchSales: `
    SELECT s.order_id, 
           MAX(s.creation_date) as creation_date, 
           SUM(s.quantity) as total_quantity, 
           SUM(s.price) as price,
           COUNT(DISTINCT s.product_id) as total_products
    FROM ${sales_table} s
    WHERE s.order_id LIKE ? OR s.creation_date LIKE ?
    GROUP BY s.order_id
    ORDER BY MAX(s.creation_date) DESC
    LIMIT ? OFFSET ?
  `,

  getTotalSearchSalesCount: `
    SELECT COUNT(DISTINCT order_id) as total
    FROM ${sales_table}
    WHERE order_id LIKE ?
  `,

  getSaleDetails: `
    SELECT s.order_id, s.product_id, s.quantity, s.price, s.total, s.creation_date,
           p.product_title
    FROM ${sales_table} s
    JOIN ${products_table} p ON s.product_id = p.product_id
    WHERE s.order_id = ?
    ORDER BY s.creation_date DESC
  `,
};

module.exports = queries;
