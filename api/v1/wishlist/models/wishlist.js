const connection = require("../../connection/connection");
const queries = require("../queries/wishlist");

const wishlist = {
  addToWishlist: async (userId, productId) => {
    try {
      // Check if the item is already in the wishlist
      const [existingItem] = await connection.query(queries.checkWishlistItem, [
        userId,
        productId,
      ]);

      if (existingItem.length > 0) {
        // Item already exists, remove it (toggle functionality)
        await connection.query(queries.removeFromWishlist, [userId, productId]);
        return { added: false, message: "Item removed from wishlist" };
      } else {
        // Item doesn't exist, add it
        await connection.query(queries.addToWishlist, [userId, productId]);
        return { added: true, message: "Item added to wishlist" };
      }
    } catch (error) {
      console.error("Add to wishlist error:", error);
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        throw new Error("Invalid user ID or product ID");
      }
      throw error;
    }
  },

  getWishlistStatus: async (userId, productId) => {
    try {
      const [result] = await connection.query(queries.getWishlistStatus, [
        userId,
        productId,
      ]);
      return result[0].in_wishlist === 1;
    } catch (error) {
      console.error("Get wishlist status error:", error);
      throw error;
    }
  },
  getWishlistItems: async (userId) => {
    try {
      const [wishlistItems] = await connection.query(queries.getWishlistItems, [
        userId,
      ]);
      return wishlistItems;
    } catch (error) {
      console.error("Get wishlist items error:", error);
      throw error;
    }
  },
};

module.exports = wishlist;
