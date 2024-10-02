const table_name = "orders";

const queries = {
  createOrder: `INSERT INTO ${table_name} (product_id, user_id, shipping_id, order_date, quantity, order_status) VALUES (?, ?, ?, NOW(), ?, 0)`,
  getOrderById: `SELECT * FROM ${table_name} WHERE order_id = ?`,
  getOrdersByUserId: `SELECT o.order_id, o.product_id, o.user_id, o.shipping_id, o.order_date, o.quantity, o.order_status, o.price, p.product_title, p.product_thumbnail FROM ${table_name} as o  INNER JOIN products as p ON o.product_id = p.product_id WHERE user_id = ? ORDER BY order_date DESC`,
  updateOrderStatus: `UPDATE ${table_name} SET order_status = ? WHERE order_id = ?`,
  deleteOrder: `DELETE FROM ${table_name} WHERE order_id = ?`,
};

module.exports = queries;
