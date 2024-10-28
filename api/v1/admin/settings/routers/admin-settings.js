const express = require("express");
const router = express.Router();
const admin_settings = require("../models/admin-settings");
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

router.get("/admin/monthly_goal", async (req, res) => {
  try {
    const monthlyGoal = await admin_settings.getMonthlyGoal();
    return res.status(200).json({
      success: true,
      data: monthlyGoal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching monthly goal.",
      error: error.message,
    });
  }
});

router.put("/admin/monthly_goal", authenticateUser, async (req, res) => {
  const { monthly_goal } = req.body;
  if (isEmpty(monthly_goal)) {
    return res
      .status(400)
      .json({ success: false, message: "Monthly goal is required" });
  }
  try {
    const updated = await admin_settings.updateMonthlyGoal(monthly_goal);
    if (updated) {
      return res.status(200).json({
        success: true,
        message: "Monthly goal updated successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Monthly goal not updated. Admin might not exist.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating monthly goal.",
      error: error.message,
    });
  }
});

module.exports = router;
