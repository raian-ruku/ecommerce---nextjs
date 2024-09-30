const express = require("express");
const router = express.Router();
const wishlist = require("../models/wishlist");

const { verifyToken } = require("../../jwt");

router.post("/add-to-wishlist", async (req, res) => {
  const token = req.cookies.token;
  const { productId } = req.body;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  if (!productId) {
    return res
      .status(400)
      .json({ success: false, message: "Product ID is required" });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const result = await wishlist.addToWishlist(decoded.id, productId);
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.get("/wishlist-status/:productId", async (req, res) => {
  const token = req.cookies.token;
  const { productId } = req.params;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  try {
    const decoded = verifyToken(token);
    if (decoded) {
      const inWishlist = await wishlist.getWishlistStatus(
        decoded.id,
        productId,
      );
      return res.status(200).json({
        success: true,
        inWishlist,
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error getting wishlist status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.get("/wishlist", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  try {
    const decoded = verifyToken(token);
    if (decoded) {
      const wishlistItems = await wishlist.getWishlistItems(decoded.id);
      return res.status(200).json({
        success: true,
        data: wishlistItems,
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
