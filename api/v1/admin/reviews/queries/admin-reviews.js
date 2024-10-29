const queries = {
  getReviews: `
    SELECT 
      r.review_id,
      u.user_name AS reviewer,
      p.product_title AS product,
      r.review_comment AS review,
      r.review_rating,
      r.creation_date
    FROM 
      reviews r
      JOIN users u ON r.user_id = u.user_id
      JOIN products p ON r.product_id = p.product_id
    WHERE 
      u.user_name LIKE ? OR
      p.product_title LIKE ? OR
      r.review_comment LIKE ?
    ORDER BY 
      r.creation_date DESC
    LIMIT ? OFFSET ?
  `,

  getTotalReviews: `
    SELECT 
      COUNT(*) AS total
    FROM 
      reviews r
      JOIN users u ON r.user_id = u.user_id
      JOIN products p ON r.product_id = p.product_id
    WHERE 
      u.user_name LIKE ? OR
      p.product_title LIKE ? OR
      r.review_comment LIKE ?
  `,

  deleteReview: `
    DELETE FROM reviews
    WHERE review_id = ?
  `,
};

module.exports = queries;
