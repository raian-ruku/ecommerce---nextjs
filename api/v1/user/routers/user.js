const express = require("express");
const router = express.Router();
const users = require("../models/user");
const isEmpty = require("is-empty");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  const { user_name, user_email, user_password } = req.body;

  // Validate the inputs
  if (isEmpty(user_name) || isEmpty(user_email) || isEmpty(user_password)) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "All fields are required.",
    });
  }

  try {
    // Create the account and get the newly inserted user data
    const newUser = await users.createAccount(
      user_name,
      user_email,
      user_password,
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

module.exports = router;
