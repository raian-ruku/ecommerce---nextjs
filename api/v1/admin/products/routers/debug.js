const mysql = require("mysql2/promise");

// Mock connection for testing
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "raian123",
  database: "ecommerce",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Mock queries object
const queries = {
  updateProduct: `
    UPDATE products
    SET 
      product_title = COALESCE(?, product_title),
      product_description = COALESCE(?, product_description),
      product_discount = COALESCE(?, product_discount),
      product_brand = COALESCE(?, product_brand),
      product_sku = COALESCE(?, product_sku),
      product_warranty = COALESCE(?, product_warranty),
      product_shipping = COALESCE(?, product_shipping),
      product_return = COALESCE(?, product_return),
      product_minimum = COALESCE(?, product_minimum),
      product_weight = COALESCE(?, product_weight),
      product_thumbnail = COALESCE(?, product_thumbnail),
      category_id = COALESCE(?, category_id)
    WHERE product_id = ?
  `,
  updateProductMaster: `
    UPDATE products_master
    SET purchase_price = ?, product_price = ?, product_stock = ?
    WHERE product_id = ?
  `,
  updateDimensions: `
    UPDATE dimensions 
    SET height = ?, width = ?, depth = ?
    WHERE product_id = ?
  `,
  deleteProductImages: `
    DELETE FROM images
    WHERE product_id = ?
  `,
  addProductImage: `
    INSERT INTO images (product_id, image_data)
    VALUES (?, ?)
  `,
};

async function updateProduct(productId, productData) {
  const conn = await connection.getConnection();
  try {
    console.log("Starting transaction...");
    await conn.beginTransaction();

    console.log("Updating products table...");
    await conn.query(queries.updateProduct, [
      productData.product_title,
      productData.product_description,
      productData.product_discount,
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

    console.log("Updating products_master table...");
    if (
      productData.purchase_price ||
      productData.product_price ||
      productData.product_stock
    ) {
      await conn.query(queries.updateProductMaster, [
        productData.purchase_price,
        productData.product_price,
        productData.product_stock,
        productId,
      ]);
    }

    console.log("Updating dimensions table...");
    if (productData.height || productData.width || productData.depth) {
      await conn.query(queries.updateDimensions, [
        productData.height,
        productData.width,
        productData.depth,
        productId,
      ]);
    }

    console.log("Handling image updates...");
    if (productData.newImages && productData.newImages.length > 0) {
      console.log("Deleting existing images...");
      await conn.query(queries.deleteProductImages, [productId]);

      console.log("Inserting new images...");
      for (const imageName of productData.newImages) {
        await conn.query(queries.addProductImage, [productId, imageName]);
      }
    } else if (productData.product_thumbnail) {
      console.log("Using thumbnail as image...");
      await conn.query(queries.deleteProductImages, [productId]);
      await conn.query(queries.addProductImage, [
        productId,
        productData.product_thumbnail,
      ]);
    }

    await conn.commit();
    console.log("Product update completed successfully");
  } catch (error) {
    await conn.rollback();
    console.error("Update product error:", error);
    throw error;
  } finally {
    conn.release();
  }
}

// Test the function with mock data
const mockProductData = {
  product_title: "Updated Product",
  product_description: "This is an updated product",
  product_discount: 10,
  product_brand: "Brand X",
  product_sku: "SKU123",
  product_warranty: "1 year",
  product_shipping: "Free shipping",
  product_return: "30-day return",
  product_minimum: 1,
  product_weight: 1.5,
  product_thumbnail: "/images/thumbnail.jpg",
  category_id: 1,
  purchase_price: 50,
  product_price: 100,
  product_stock: 100,
  height: 10,
  width: 20,
  depth: 5,
  newImages: ["/images/image1.jpg", "/images/image2.jpg"],
};

updateProduct(1, mockProductData)
  .then(() => console.log("Test completed successfully"))
  .catch((error) => console.error("Test failed:", error))
  .finally(() => process.exit());
