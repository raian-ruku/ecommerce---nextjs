const orders_table = "orders";
const order_items_table = "order_items";

const queries = {
  createOrder: `INSERT INTO ${orders_table} (user_id, shipping_id,  total_price, order_date, order_status) VALUES (?,?,?, CURRENT_TIMESTAMP, 0)`,
  createOrderItem: `INSERT INTO ${order_items_table} (order_id, product_id, quantity, price, shipping_cost, tax) VALUES (?, ?, ?, ?, ?, ?)`,
  getOrderById: `SELECT o.*, s.shipping_street, s.shipping_city, s.shipping_state, s.shipping_zip, s.shipping_country FROM ${orders_table} o JOIN shipping_address s ON o.shipping_id = s.shipping_id WHERE o.order_id = ?`,
  getOrdersByUserId: `SELECT o.*, s.shipping_street, s.shipping_city, s.shipping_state, s.shipping_zip, s.shipping_country, oi.*, p.product_title, p.product_thumbnail FROM ${orders_table} o JOIN shipping_address s ON o.shipping_id = s.shipping_id  INNER JOIN order_items oi ON o.order_id = oi.order_id INNER JOIN products p ON oi.product_id = p.product_id WHERE o.user_id = ? ORDER BY o.order_id DESC`,
};

module.exports = queries;
