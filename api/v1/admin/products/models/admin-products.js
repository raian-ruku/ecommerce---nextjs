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

  updateProduct: async (productId, productData) => {
    const {
      product_title,
      product_sku,
      product_thumbnail,
      category_id,
      purchase_price,
      product_price,
      product_stock,
      height,
      width,
      depth,
    } = productData;

    const conn = await connection.getConnection();

    try {
      await conn.beginTransaction();

      await conn.query(queries.updateProduct, [
        product_title,
        product_sku,
        product_thumbnail,
        category_id,
        productId,
      ]);

      await conn.query(queries.updateProductMaster, [
        purchase_price,
        product_price,
        product_stock,
        productId,
      ]);

      await conn.query(queries.updateDimensions, [
        height,
        width,
        depth,
        productId,
      ]);

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      console.error("Update product error:", error);
      throw error;
    } finally {
      conn.release();
    }
  },

  deleteProduct: async (productId) => {
    const conn = await connection.getConnection();

    try {
      await conn.beginTransaction();

      await conn.query(queries.deleteProductMaster, [productId]);
      await conn.query(queries.deleteDimensions, [productId]);
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

  addProductImage: async (productId, imageData) => {
    try {
      await connection.query(queries.addProductImage, [productId, imageData]);
    } catch (error) {
      console.error("Add product image error:", error);
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
