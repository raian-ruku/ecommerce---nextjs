const connection = require("../../../connection/connection");
const queries = require("../queries/admin-products");

const admin_products = {
  getAllProducts: async (page, pageSize, searchTerm) => {
    try {
      const offset = (page - 1) * pageSize;
      let products, totalCount;

      if (searchTerm) {
        const searchPattern = `%${searchTerm}%`;
        [products] = await connection.query(queries.searchProducts, [
          searchPattern,
          searchPattern,
          searchPattern,
          searchPattern,
          pageSize,
          offset,
        ]);
        [[{ total }]] = await connection.query(
          queries.getTotalSearchProductCount,
          [searchPattern, searchPattern, searchPattern, searchPattern],
        );
      } else {
        [products] = await connection.query(queries.getAllProducts, [
          pageSize,
          offset,
        ]);
        [[{ total }]] = await connection.query(queries.getTotalProductCount);
      }

      return {
        products,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      console.error("Get products error:", error);
      throw error;
    }
  },

  addProduct: async (productData) => {
    const conn = await connection.getConnection();
    console.log(
      "Starting addProduct function with data:",
      JSON.stringify(productData, null, 2),
    );

    try {
      await conn.beginTransaction();
      console.log("Transaction begun");

      // Insert into products table
      console.log("Inserting into products table...");
      const [result] = await conn.query(queries.addProduct, [
        productData.product_title,
        productData.product_sku,
        productData.product_thumbnail,
        productData.category_id,
      ]);
      console.log("Products insert result:", result);

      const productId = result.insertId;
      console.log("New product ID:", productId);

      // Insert into products_master table
      console.log("Inserting into products_master table...");
      const [masterResult] = await conn.query(queries.addProductMaster, [
        productId,
        productData.purchase_price,
        productData.product_price,
        productData.product_stock,
      ]);
      console.log("Products master insert result:", masterResult);

      // Insert into dimensions table
      if (productData.height || productData.width || productData.depth) {
        console.log("Inserting into dimensions table...");
        const [dimensionsResult] = await conn.query(queries.addDimensions, [
          productId,
          productData.height || null,
          productData.width || null,
          productData.depth || null,
        ]);
        console.log("Dimensions insert result:", dimensionsResult);
      }

      // Insert product images
      if (productData.productImages && productData.productImages.length > 0) {
        console.log("Inserting product images...");
        for (const imageName of productData.productImages) {
          const [imageResult] = await conn.query(queries.addProductImage, [
            productId,
            imageName,
          ]);
          console.log("Image insert result:", imageResult);
        }
      }

      await conn.commit();
      console.log("Transaction committed successfully");
      return productId;
    } catch (error) {
      console.error("Error in addProduct:", error);
      await conn.rollback();
      console.log("Transaction rolled back due to error");
      throw error;
    } finally {
      conn.release();
      console.log("Database connection released");
    }
  },

  updateProduct: async (productId, productData) => {
    const conn = await connection.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(queries.updateProduct, [
        productData.product_title,
        productData.product_sku,
        productData.product_thumbnail,
        productData.category_id,
        productId,
      ]);

      await conn.query(queries.updateProductMaster, [
        productData.purchase_price,
        productData.product_price,
        productData.product_stock,
        productId,
      ]);

      if (productData.height || productData.width || productData.depth) {
        await conn.query(queries.updateDimensions, [
          productData.height || null,
          productData.width || null,
          productData.depth || null,
          productId,
        ]);
      }

      if (productData.newImages && productData.newImages.length > 0) {
        for (const imageName of productData.newImages) {
          await conn.query(queries.addProductImage, [productId, imageName]);
        }
      }

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      console.error("Update product error:", error);
      throw error;
    } finally {
      conn.release();
    }
  },

  getProductImages: async (productId) => {
    try {
      const [images] = await connection.query(queries.getProductImages, [
        productId,
      ]);
      return images;
    } catch (error) {
      console.error("Get product images error:", error);
      throw error;
    }
  },

  deleteProductImage: async (imageId) => {
    try {
      await connection.query(queries.deleteProductImage, [imageId]);
    } catch (error) {
      console.error("Delete product image error:", error);
      throw error;
    }
  },

  getAllCategories: async () => {
    try {
      const [categories] = await connection.query(queries.getAllCategories);
      return categories;
    } catch (error) {
      console.error("Get categories error:", error);
      throw error;
    }
  },
};

module.exports = admin_products;
