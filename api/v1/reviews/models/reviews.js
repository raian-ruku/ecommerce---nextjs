const connection = require("../../connection/connection");
const queries = require("../queries/reviews");

const reviewModel = {
  addReview: async (productId, userId, rating, comment) => {
    try {
      const [result] = await connection.query(queries.addReview, [
        productId,
        userId,
        rating,
        comment,
      ]);
      return result.insertId;
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  },

  getReviewsByProductId: async (productId, page = 1, pageSize = 10) => {
    try {
      const offset = (page - 1) * pageSize;
      const [reviews] = await connection.query(queries.getReviewsByProductId, [
        productId,
        pageSize,
        offset,
      ]);
      return reviews;
    } catch (error) {
      console.error("Error getting reviews:", error);
      throw error;
    }
  },

  getAverageRatingByProductId: async (productId) => {
    try {
      const [[result]] = await connection.query(
        queries.getAverageRatingByProductId,
        [productId],
      );
      return result.average_rating || 0;
    } catch (error) {
      console.error("Error getting average rating:", error);
      throw error;
    }
  },

  getTotalReviewCountByProductId: async (productId) => {
    try {
      const [[result]] = await connection.query(
        queries.getTotalReviewCountByProductId,
        [productId],
      );
      return result.total_reviews;
    } catch (error) {
      console.error("Error getting total review count:", error);
      throw error;
    }
  },

  checkUserReview: async (productId, userId) => {
    try {
      const [result] = await connection.query(queries.checkUserReview, [
        productId,
        userId,
      ]);
      return result.length > 0 ? result[0].review_id : null;
    } catch (error) {
      console.error("Error checking user review:", error);
      throw error;
    }
  },

  updateReview: async (reviewId, rating, comment) => {
    try {
      await connection.query(queries.updateReview, [rating, comment, reviewId]);
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  },

  deleteReview: async (reviewId) => {
    try {
      await connection.query(queries.deleteReview, [reviewId]);
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  },
};

module.exports = reviewModel;
