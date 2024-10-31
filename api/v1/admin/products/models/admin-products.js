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
  getProductById: async (productId) => {
    try {
      const [product] = await connection.query(queries.getProductById, [
        productId,
      ]);
      return product;
    } catch (error) {
      console.error("Get product by ID error:", error);
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

      // Insert into products table
      const [result] = await conn.query(queries.addProduct, [
        productData.product_title,
        productData.product_description,
        productData.product_discount
          ? parseFloat(productData.product_discount)
          : null,
        productData.product_brand,
        productData.product_sku,
        productData.product_warranty,
        productData.product_shipping,
        productData.product_return,
        productData.product_minimum,
        productData.product_weight,
        productData.product_thumbnail,
        productData.barcode,
        productData.qrcode,
        productData.category_id,
      ]);

      const productId = result.insertId;

      // Insert into products_master table
      await conn.query(queries.addProductMaster, [
        productId,
        parseFloat(productData.purchase_price),
        parseFloat(productData.product_price),
        parseInt(productData.product_stock),
      ]);

      // Insert into dimensions table
      if (productData.height || productData.width || productData.depth) {
        await conn.query(queries.addDimensions, [
          productId,
          productData.height ? parseFloat(productData.height) : null,
          productData.width ? parseFloat(productData.width) : null,
          productData.depth ? parseFloat(productData.depth) : null,
        ]);
      }

      // Insert product images
      if (productData.productImages && productData.productImages.length > 0) {
        for (const imageName of productData.productImages) {
          await conn.query(queries.addProductImage, [productId, imageName]);
        }
      }

      await conn.commit();
      return productId;
    } catch (error) {
      await conn.rollback();
      console.error("Error in addProduct:", error);
      throw error;
    } finally {
      conn.release();
    }
  },

  updateProduct: async (productId, productData) => {
    const conn = await connection.getConnection();
    try {
      await conn.beginTransaction();

      // Update products table
      if (queries.updateProduct) {
        await conn.query(queries.updateProduct, [
          productData.product_title,
          productData.product_description,
          productData.product_discount
            ? parseFloat(productData.product_discount)
            : null,
          productData.product_brand,
          productData.product_sku,
          productData.product_warranty,
          productData.product_shipping,
          productData.product_return,
          productData.product_minimum,
          productData.product_weight,
          productData.product_thumbnail,
          productData.category_id,
          productId,
        ]);
      } else {
        throw new Error("updateProduct query is undefined");
      }

      // Update products_master table if price or stock is changed
      if (
        productData.purchase_price ||
        productData.product_price ||
        productData.product_stock
      ) {
        if (queries.updateProductMaster) {
          await conn.query(queries.updateProductMaster, [
            productData.purchase_price
              ? parseFloat(productData.purchase_price)
              : null,
            productData.product_price
              ? parseFloat(productData.product_price)
              : null,
            productData.product_stock
              ? parseInt(productData.product_stock)
              : null,
            productId,
          ]);
        } else {
          throw new Error("updateProductMaster query is undefined");
        }
      }

      // Update dimensions table if any dimension is changed
      if (productData.height || productData.width || productData.depth) {
        if (queries.updateDimensions) {
          await conn.query(queries.updateDimensions, [
            productData.height ? parseFloat(productData.height) : null,
            productData.width ? parseFloat(productData.width) : null,
            productData.depth ? parseFloat(productData.depth) : null,
            productId,
          ]);
        } else {
          throw new Error("updateDimensions query is undefined");
        }
      }

      // Handle image updates
      const existingImages = productData.existingImages || [];
      const newImages = productData.newImages || [];

      // Delete images that are no longer in existingImages
      if (queries.getProductImages && queries.deleteProductImage) {
        const [currentImages] = await conn.query(queries.getProductImages, [
          productId,
        ]);
        for (const image of currentImages) {
          if (!existingImages.includes(image.image_data)) {
            await conn.query(queries.deleteProductImage, [image.image_id]);
            // Delete the file from the server
            try {
              await fs.unlink(
                path.join(
                  __dirname,
                  "..",
                  "..",
                  "..",
                  "..",
                  "public",
                  image.image_data,
                ),
              );
            } catch (unlinkError) {
              console.error("Error deleting image file:", unlinkError);
            }
          }
        }
      } else {
        throw new Error(
          "getProductImages or deleteProductImage query is undefined",
        );
      }

      // Add new images
      if (queries.addProductImage) {
        for (const imagePath of newImages) {
          await conn.query(queries.addProductImage, [productId, imagePath]);
        }
      } else {
        throw new Error("addProductImage query is undefined");
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
  deleteProduct: async (productId) => {
    const conn = await connection.getConnection();
    try {
      await conn.beginTransaction();

      // Delete from images first, using `product_id`
      await conn.query(queries.deleteProductImage, [productId]);
      // Then delete from dimensions
      await conn.query(queries.deleteDimensions, [productId]);
      // Then delete from product master
      await conn.query(queries.deleteProductMaster, [productId]);
      // Finally, delete from the main products table
      await conn.query(queries.deleteProduct, [productId]);

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      console.error("Delete product error:", error);
      throw error;
    } finally {
      conn.release();
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
