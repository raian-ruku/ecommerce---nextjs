const express = require("express");
const router = express.Router();
const admin_customers = require("../models/admin-customers");
const { verifyToken } = require("../../../jwt");
const isEmpty = require("is-empty");

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

router.get("/admin/customers", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this page.",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchTerm = req.query.search || "";

    const result = await admin_customers.getAllCustomers(
      page,
      pageSize,
      searchTerm,
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching customers.",
      error: error.message,
    });
  }
});
router.get(
  "/admin/customer/:id/shipping-addresses",
  authenticateUser,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this information.",
        });
      }

      const userId = req.params.id;
      const addresses =
        await admin_customers.getCustomerShippingAddresses(userId);

      return res.status(200).json({
        success: true,
        addresses,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching customer shipping addresses.",
        error: error.message,
      });
    }
  },
);

module.exports = router;
