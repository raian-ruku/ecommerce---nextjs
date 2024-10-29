const express = require("express");
const router = express.Router();
const reviewModel = require("../models/reviews");
const { verifyToken } = require("../../jwt");

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }
  try {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

router.post("/reviews", authenticateUser, async (req, res) => {
  try {
    const { product_id, review_rating, review_comment } = req.body;
    const userId = req.user.id;

    // Check if user has already reviewed this product
    const existingReviewId = await reviewModel.checkUserReview(
      product_id,
      userId,
    );
    if (existingReviewId) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const reviewId = await reviewModel.addReview(
      product_id,
      userId,
      review_rating,
      review_comment,
    );
    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review_id: reviewId,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res
      .status(500)
      .json({ success: false, message: "Error adding review", error: error });
  }
});

router.get("/reviews/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const reviews = await reviewModel.getReviewsByProductId(
      productId,
      page,
      pageSize,
    );
    const totalReviews =
      await reviewModel.getTotalReviewCountByProductId(productId);
    const averageRating =
      await reviewModel.getAverageRatingByProductId(productId);

    res.status(200).json({
      success: true,
      reviews,
      totalReviews,
      averageRating,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / pageSize),
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
});

router.put("/reviews/:reviewId", authenticateUser, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { review_rating, review_comment } = req.body;

    await reviewModel.updateReview(reviewId, review_rating, review_comment);
    res
      .status(200)
      .json({ success: true, message: "Review updated successfully" });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ success: false, message: "Error updating review" });
  }
});

router.delete("/reviews/:reviewId", authenticateUser, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    await reviewModel.deleteReview(reviewId);
    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, message: "Error deleting review" });
  }
});

module.exports = router;
