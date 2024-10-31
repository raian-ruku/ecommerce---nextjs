const express = require("express");
const router = express.Router();
const admin_products = require("../models/admin-products");
const { verifyToken } = require("../../../jwt");
const isEmpty = require("is-empty");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../../../../public/images/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage: storage });

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

router.get("/admin/all-products", authenticateUser, async (req, res) => {
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

    const result = await admin_products.getAllProducts(
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
      message: "Error fetching products.",
      error: error.message,
    });
  }
});

router.post(
  "/admin/add-product",
  authenticateUser,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "productImages", maxCount: 10 },
  ]),
  async (req, res) => {
    const relativePath = "/images/uploads/";
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to perform this action.",
        });
      }

      const productData = req.body;
      if (req.files["thumbnail"]) {
        productData.product_thumbnail =
          relativePath + req.files["thumbnail"][0].filename;
      }
      if (req.files["productImages"] && req.files["productImages"].length > 0) {
        // Map productImages if files exist
        productData.productImages = req.files["productImages"].map(
          (file) => relativePath + file.filename,
        );
      } else {
        // Default to using product_thumbnail if no productImages are uploaded
        productData.productImages = [productData.product_thumbnail];
      }

      const productId = await admin_products.addProduct(productData);

      return res.status(201).json({
        success: true,
        message: "Product added successfully",
        productId: productId,
      });
    } catch (error) {
      console.error("Error in add product route:", error);
      return res.status(500).json({
        success: false,
        message: "Error adding product.",
        error: error.message,
      });
    }
  },
);

router.get("/admin/product/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this information.",
      });
    }
    const product = await admin_products.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching product.",
      error: error.message,
    });
  }
});

router.put(
  "/admin/product/:id",
  authenticateUser,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "productImages", maxCount: 10 },
  ]),
  async (req, res) => {
    const relativePath = "/images/uploads/";
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to perform this action.",
        });
      }

      const productData = req.body;
      if (req.files["thumbnail"]) {
        productData.product_thumbnail =
          relativePath + req.files["thumbnail"][0].filename;
      }
      if (req.files["productImages"]) {
        productData.newImages = req.files["productImages"].map(
          (file) => relativePath + file.filename,
        );
      }

      await admin_products.updateProduct(req.params.id, productData);

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
      });
    } catch (error) {
      console.error("Error in update product route:", error);
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          error: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error updating product.",
        error: error.message,
      });
    }
  },
);

router.get("/admin/product/:id/images", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this information.",
      });
    }
    const images = await admin_products.getProductImages(req.params.id);
    return res.status(200).json({ success: true, images });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching product images.",
      error: error.message,
    });
  }
});

router.delete(
  "/admin/product/image/:id",
  authenticateUser,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to perform this action.",
        });
      }
      await admin_products.deleteProductImage(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Product image deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error deleting product image.",
        error: error.message,
      });
    }
  },
);

router.delete("/admin/product/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action.",
      });
    }
    await admin_products.deleteProduct(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting product.",
      error: error.message,
    });
  }
});

router.get("/admin/categories", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this information.",
      });
    }
    const categories = await admin_products.getAllCategories();
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching categories.",
      error: error.message,
    });
  }
});

module.exports = router;
