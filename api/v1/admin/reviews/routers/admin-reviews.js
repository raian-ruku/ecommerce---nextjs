const express = require("express");
const router = express.Router();
const reviewModel = require("../models/admin-reviews");

router.get("/admin/reviews", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const reviews = await reviewModel.getReviews(page, limit, search);
    const totalReviews = await reviewModel.getTotalReviews(search);

    res.json({
      success: true,
      data: reviews,
      totalPages: Math.ceil(totalReviews / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
});

router.delete("/admin/reviews/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;
    await reviewModel.deleteReview(reviewId);
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, message: "Error deleting review" });
  }
});

module.exports = router;
