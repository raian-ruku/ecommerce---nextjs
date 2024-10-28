const orders_table = "orders";

const queries = {
  getPendingOrders: `SELECT o.order_date, o.order_status, o.order_id, s.shipping_street, s.shipping_city, s.shipping_state, s.shipping_zip, s.shipping_country, oi.product_id, oi.price, p.product_title, p.product_thumbnail FROM orders o JOIN shipping_address s ON o.shipping_id = s.shipping_id  INNER JOIN order_items oi ON o.order_id = oi.order_id INNER JOIN products p ON oi.product_id = p.product_id WHERE o.order_status=0 OR o.order_status=1 ORDER BY o.order_status ASC, o.order_date ASC`,
  getOrderSales: `SELECT order_id, order_date, total_price  FROM ${orders_table} WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) ORDER BY order_date ASC`,
  getOrderDates: `SELECT order_id, order_date FROM ${orders_table} WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) ORDER BY order_date ASC`,

  updateOrderStatus: `UPDATE ${orders_table} SET order_status = ?, last_updated_by = "admin", last_update_date = CURRENT_TIMESTAMP WHERE order_id = ?`,
  deleteOrder: `DELETE FROM ${orders_table} WHERE order_id = ?`,
  deleteOrderItems: `DELETE FROM order_items WHERE order_id = ?`,
  getOrderById: `SELECT o.*, s.shipping_street, s.shipping_city, s.shipping_state, s.shipping_zip, s.shipping_country FROM ${orders_table} o JOIN shipping_address s ON o.shipping_id = s.shipping_id WHERE o.order_id = ?`,
  getTopProducts: `
  SELECT p.product_id,
      p.product_title as product_name, 
      COUNT(DISTINCT o.order_id) as order_count,
      SUM(oi.price) as total_price,
      SUM( oi.price - (PM.purchase_price * oi.quantity) ) as revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    JOIN ${orders_table} o ON oi.order_id = o.order_id
    JOIN products_master PM ON p.product_id = PM.product_id
    WHERE o.order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY p.product_id
    ORDER BY order_count DESC
    LIMIT 5`,
  getAllOrders: `
SELECT 
    o.order_id, 
    o.order_date, 
    o.total_price, 
    o.order_status,
    MAX(s.shipping_street) AS shipping_street, 
    MAX(s.shipping_state) AS shipping_state, 
    MAX(s.shipping_city) AS shipping_city, 
    MAX(s.shipping_zip) AS shipping_zip, 
    MAX(s.shipping_country) AS shipping_country, 
    MAX(u.user_name) AS user_name, 
    MAX(u.user_email) AS user_email,
    (SELECT GROUP_CONCAT(CONCAT(p.product_title, ' (', oi2.quantity, ')') SEPARATOR ', ')
     FROM order_items oi2
     JOIN products p ON oi2.product_id = p.product_id
     WHERE oi2.order_id = o.order_id) AS items,
    (SELECT COUNT(*)
     FROM order_items oi3
     WHERE oi3.order_id = o.order_id) AS item_count,
    (SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'product_id', p.product_id,
            'product_title', p.product_title,
            'quantity', oi4.quantity,
            'price', oi4.price
        )
     )
     FROM order_items oi4
     JOIN products p ON oi4.product_id = p.product_id
     WHERE oi4.order_id = o.order_id) AS item_details
FROM orders o
LEFT JOIN users u ON o.user_id = u.user_id
LEFT JOIN shipping_address s ON u.user_id = s.user_id
GROUP BY o.order_id, o.order_date, o.total_price, o.order_status
ORDER BY o.order_date DESC
LIMIT ? OFFSET ?
  `,

  getTotalOrderCount: `
    SELECT COUNT(*) AS total FROM ${orders_table}
  `,
};

module.exports = queries;
