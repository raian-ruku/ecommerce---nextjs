const reviews_table = "reviews";
const users_table = "users";

const queries = {
  addReview: `
    INSERT INTO ${reviews_table} (product_id, user_id, review_rating, review_comment, creation_date)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `,

  getReviewsByProductId: `
    SELECT r.review_id, r.review_rating, r.review_comment, r.creation_date,
           u.user_name
    FROM ${reviews_table} r
    JOIN ${users_table} u ON r.user_id = u.user_id
    WHERE r.product_id = ?
    ORDER BY r.creation_date DESC
    LIMIT ? OFFSET ?
  `,

  getAverageRatingByProductId: `
    SELECT AVG(review_rating) as average_rating
    FROM ${reviews_table}
    WHERE product_id = ?
  `,

  getTotalReviewCountByProductId: `
    SELECT COUNT(*) as total_reviews
    FROM ${reviews_table}
    WHERE product_id = ?
  `,

  checkUserReview: `
    SELECT review_id
    FROM ${reviews_table}
    WHERE product_id = ? AND user_id = ?
  `,

  updateReview: `
    UPDATE ${reviews_table}
    SET review_rating = ?, review_comment = ?
    WHERE review_id = ?
  `,

  deleteReview: `
    DELETE FROM ${reviews_table}
    WHERE review_id = ?
  `,
};

module.exports = queries;
