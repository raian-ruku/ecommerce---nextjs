const table_name = "wishlist";

const queries = {
  addToWishlist: `INSERT INTO ${table_name} (user_id, product_id) VALUES (?, ?)`,
  getWishlistStatus: `SELECT COUNT(*) > 0 AS in_wishlist FROM ${table_name} WHERE user_id = ? AND product_id = ?`,
  checkWishlistItem: `SELECT * FROM ${table_name} WHERE user_id = ? AND product_id = ?`,
  removeFromWishlist: `DELETE FROM ${table_name} WHERE user_id = ? AND product_id = ?`,
  getWishlistItems: `
    SELECT p.product_id, p.product_title, p.product_thumbnail, PM.product_price 
    FROM ${table_name} as w
    INNER JOIN products as p ON w.product_id = p.product_id
    INNER JOIN products_master as PM ON w.product_id = PM.product_id
    WHERE w.user_id = ?
  `,
};

module.exports = queries;
