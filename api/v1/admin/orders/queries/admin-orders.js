const orders_table = "orders";

const queries = {
  getPendingOrders: `SELECT o.order_date, o.order_status, o.order_id, s.shipping_street, s.shipping_city, s.shipping_state, s.shipping_zip, s.shipping_country, oi.product_id, oi.price, p.product_title, p.product_thumbnail FROM orders o JOIN shipping_address s ON o.shipping_id = s.shipping_id  INNER JOIN order_items oi ON o.order_id = oi.order_id INNER JOIN products p ON oi.product_id = p.product_id WHERE o.order_status=0 OR o.order_status=1 ORDER BY o.order_status ASC, o.order_date ASC`,
  getOrderSales: `SELECT order_id, order_date, total_price  FROM ${orders_table} WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) ORDER BY order_date ASC`,
  getOrderDates: `SELECT order_id, order_date FROM ${orders_table} WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) ORDER BY order_date ASC`,
  getMonthlyGoal: `SELECT monthly_goal FROM admin_user WHERE admin_id = 2`,
  getTopProducts: `
  SELECT p.product_id,
      p.product_title as product_name, 
      COUNT(DISTINCT o.order_id) as order_count,
      SUM(oi.price) as total_price,
      SUM(o.total_price - oi.price - oi.shipping_cost ) as revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    JOIN ${orders_table} o ON oi.order_id = o.order_id
    WHERE o.order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY p.product_id
    ORDER BY order_count DESC
    LIMIT 5`,
};

//TODO: fix the revenue with purchase price and sales price

module.exports = queries;
