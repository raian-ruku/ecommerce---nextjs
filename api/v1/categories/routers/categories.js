const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();

const category = require("../models/categories");

require("dotenv").config();

router.get("/category-list", async (req, res) => {
  let result = await category.getList(
    { id: "ASC" },

    ["id", "category_name"],
  );

  return res.status(200).send({
    success: true,
    status: 200,
    message: "Category list.",
    count: result.length,
    data: result,
  });
});

module.exports = router;
