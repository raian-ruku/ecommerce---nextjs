const connection = require("../../../connection/connection");
const queries = require("../queries/admin-reviews");

const reviewModel = {
  getReviews: async (page, limit, search) => {
    const offset = (page - 1) * limit;
    const [reviews] = await connection.query(queries.getReviews, [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      limit,
      offset,
    ]);
    return reviews;
  },

  getTotalReviews: async (search) => {
    const [[result]] = await connection.query(queries.getTotalReviews, [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
    ]);
    return result.total;
  },

  deleteReview: async (reviewId) => {
    await connection.query(queries.deleteReview, [reviewId]);
  },
};

module.exports = reviewModel;
