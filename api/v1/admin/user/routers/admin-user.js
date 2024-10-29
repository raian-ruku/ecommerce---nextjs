const express = require("express");
const router = express.Router();
const users = require("../models/admin-user");
const isEmpty = require("is-empty");
const bcrypt = require("bcrypt");
const { generateTokenAdmin, verifyToken } = require("../../../jwt");

router.post("/admin/signup", async (req, res) => {
  const { user_username, user_name, user_email, user_password } = req.body;

  // Validate the inputs
  if (
    isEmpty(user_name) ||
    isEmpty(user_username) ||
    isEmpty(user_email) ||
    isEmpty(user_password)
  ) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "All fields are required.",
    });
  }

  try {
    const existingCheck = await users.existingCheck(user_email);

    if (existingCheck) {
      return res.status(409).json({
        success: false,
        status: 409,
        message: "Email already exists.",
      });
    }
    // Create the account and get the newly inserted user data
    const newUser = await users.createAccount(
      user_email,
      user_password,
      user_username,
      user_name,
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Account created successfully.",
      data: newUser, // Send back the new user's data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error creating account.",
      error: error.message,
    });
  }
});

router.post("/admin/login", async (req, res) => {
  const { user_login, user_password } = req.body;

  // Validate the inputs
  if (isEmpty(user_login) || isEmpty(user_password)) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Email and password are required.",
    });
  }

  try {
    // Attempt to login
    const user = await users.loginByEmailorUsername(user_login, user_password);

    if (user) {
      // Generate JWT token
      const token = generateTokenAdmin(user);

      // Set the token as an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Login successful.",
        data: {
          admin_id: user.admin_id,
          admin_username: user.admin_username,
          admin_name: user.admin_name,
          admin_email: user.admin_email,
          role: user.role,
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Invalid email/username or password.",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error during login.",
      error: error.message,
    });
  }
});

router.post("/logout", (req, res) => {
  res.setHeader("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

router.get("/admin/check-auth", (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "No token found" });
  }

  try {
    const decoded = verifyToken(token);
    if (decoded) {
      // Token is valid
      return res.status(200).json({
        isAuthenticated: true,
        user: {
          id: decoded.admin_id,
          email: decoded.admin_email,
          username: decoded.admin_username,
          role: decoded.role,
        },
      });
    } else {
      // Token is invalid
      return res
        .status(401)
        .json({ isAuthenticated: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return res
      .status(500)
      .json({ isAuthenticated: false, message: "Internal server error" });
  }
});

router.get("/user-info", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  try {
    const decoded = verifyToken(token);
    if (decoded) {
      const userDetails = await users.getUserById(decoded.id);
      if (userDetails) {
        return res.status(200).json({
          success: true,
          data: userDetails,
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res
      .status(500)
      .json({ status: 500, success: false, message: "Internal server error" });
  }
});

module.exports = router;
