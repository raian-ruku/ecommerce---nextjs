const connection = require("../../../connection/connection");
const queries = require("../queries/admin-products");
//TODO: FIX IMAGE WHILE EDITING
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

      // Update products_master table if price or stock is changed
      if (
        productData.purchase_price ||
        productData.product_price ||
        productData.product_stock
      ) {
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
      }

      // Update dimensions table if any dimension is changed
      if (productData.height || productData.width || productData.depth) {
        await conn.query(queries.updateDimensions, [
          productData.height ? parseFloat(productData.height) : null,
          productData.width ? parseFloat(productData.width) : null,
          productData.depth ? parseFloat(productData.depth) : null,
          productId,
        ]);
      }

      // Handle image updates
      if (productData.newImages && productData.newImages.length > 0) {
        // Delete existing images
        await conn.query(queries.deleteProductImages, [productId]);

        // Insert new images
        for (const imageName of productData.newImages) {
          await conn.query(queries.addProductImage, [productId, imageName]);
        }
      } else if (productData.product_thumbnail) {
        // If no new images, use the thumbnail as an image
        await conn.query(queries.deleteProductImages, [productId]);
        await conn.query(queries.addProductImage, [
          productId,
          productData.product_thumbnail,
        ]);
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
