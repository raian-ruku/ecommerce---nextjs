const express = require("express");
const router = express.Router();
const colors = require("../models/color");

router.get("/custom", async (req, res) => {
  let result = await colors.getColors();

  return res.status(200).send({
    success: true,
    status: 200,
    message: "colors",
    data: result,
  });
});

router.put("/custom/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { color } = req.body;
    await colors.setColors(color, id);
    return res.status(200).send({
      success: true,
      status: 200,
      message: "Color updated successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      status: 500,
      message: "Error updating color",
      error: error.message,
    });
  }
});

module.exports = router;
