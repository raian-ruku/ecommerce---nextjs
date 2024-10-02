// routes/shippingAddress.js

const express = require("express");
const router = express.Router();
const shipping = require("../models/shipping");
const { verifyToken } = require("../../jwt");
const isEmpty = require("is-empty");

// Middleware to check if user is authenticated
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }
  try {
    const decoded = verifyToken(token);
    if (decoded) {
      req.userId = decoded.id;
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

// Get all addresses for the logged-in user
router.get("/shipping-addresses", authenticateUser, async (req, res) => {
  try {
    const addresses = await shipping.getAddresses(req.userId);
    res.json({ success: true, addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching addresses" });
  }
});

// Add a new address
router.post("/shipping-addresses", authenticateUser, async (req, res) => {
  const {
    shipping_street,
    shipping_city,
    shipping_state,
    shipping_zip,
    shipping_country,
    is_default,
  } = req.body;

  if (
    isEmpty(shipping_street) ||
    isEmpty(shipping_city) ||
    isEmpty(shipping_state) ||
    isEmpty(shipping_zip) ||
    isEmpty(shipping_country)
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const addressId = await shipping.addAddress(req.userId, {
      shipping_street,
      shipping_city,
      shipping_state,
      shipping_zip,
      shipping_country,
      is_default,
    });
    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addressId,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ success: false, message: "Error adding address" });
  }
});

// Update an existing address
router.put("/shipping-addresses/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const {
    shipping_street,
    shipping_city,
    shipping_state,
    shipping_zip,
    shipping_country,
  } = req.body;

  if (
    isEmpty(shipping_street) ||
    isEmpty(shipping_city) ||
    isEmpty(shipping_state) ||
    isEmpty(shipping_zip) ||
    isEmpty(shipping_country)
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const updated = await shipping.updateAddress(req.userId, id, {
      shipping_street,
      shipping_city,
      shipping_state,
      shipping_zip,
      shipping_country,
    });
    if (updated) {
      res.json({ success: true, message: "Address updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Address not found" });
    }
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ success: false, message: "Error updating address" });
  }
});

// Delete an address
router.delete("/shipping-addresses/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await shipping.deleteAddress(req.userId, id);
    if (deleted) {
      res.json({ success: true, message: "Address deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Address not found" });
    }
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ success: false, message: "Error deleting address" });
  }
});

// Set an address as default
router.put(
  "/shipping-addresses/:id/set-default",
  authenticateUser,
  async (req, res) => {
    const { id } = req.params;
    try {
      const updated = await shipping.setDefaultAddress(req.userId, id);
      if (updated) {
        res.json({
          success: true,
          message: "Default address updated successfully",
        });
      } else {
        res.status(404).json({ success: false, message: "Address not found" });
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      res
        .status(500)
        .json({ success: false, message: "Error setting default address" });
    }
  },
);

module.exports = router;
