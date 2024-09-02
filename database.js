const axios = require("axios");
const mysql = require("mysql2/promise");

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommerce",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function getCategoryId(categoryName) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT category_id FROM category WHERE category_name = ?",
      [categoryName],
    );
    if (rows.length > 0) {
      return rows[0].category_id;
    } else {
      const [result] = await connection.execute(
        "INSERT INTO category (category_name) VALUES (?)",
        [categoryName],
      );
      return result.insertId;
    }
  } catch (err) {
    console.error("Error getting or inserting category:", err);
    throw err;
  } finally {
    connection.release();
  }
}

async function insertProductData(product) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Get or insert category and get category_id
    const categoryId = await getCategoryId(product.category);

    // Insert into products table
    const [productResult] = await connection.execute(
      `
      INSERT INTO products (
        product_id, category_id, product_title, product_description, product_price, 
        product_discount, product_rating, product_stock, product_brand, product_sku, 
        product_weight, product_warranty, product_shipping, product_availability, 
        product_return, product_minimum, barcode, qrcode, created_by, creation_date, 
        last_updated_by, last_update_date, change_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        product.id,
        categoryId,
        product.title,
        product.description,
        product.price,
        product.discountPercentage,
        product.rating,
        product.stock,
        product.brand,
        product.sku,
        product.weight,
        product.warrantyInformation,
        product.shippingInformation,
        product.availabilityStatus === "Low Stock" ? 1 : 0,
        product.returnPolicy,
        product.minimumOrderQuantity,
        product.meta.barcode,
        product.meta.qrCode,
        "system", // created_by
        new Date(product.meta.createdAt),
        "system", // last_updated_by
        new Date(product.meta.updatedAt),
        1, // change_number
      ],
    );

    const productId = productResult.insertId;

    // Insert into dimensions table
    if (product.dimensions) {
      await connection.execute(
        `
        INSERT INTO dimensions (
          dimensions_id, product_id, height, width, depth, created_by, 
          creation_date, last_updated_by, last_update_date, change_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          null, // auto-increment id
          productId,
          product.dimensions.height,
          product.dimensions.width,
          product.dimensions.depth,
          "system",
          new Date(product.meta.createdAt),
          "system",
          new Date(product.meta.updatedAt),
          1,
        ],
      );
    }

    // Insert into tags table
    if (product.tags && product.tags.length > 0) {
      for (const tag of product.tags) {
        await connection.execute(
          `
          INSERT INTO tags (
            tags_id, product_id, created_by, creation_date, 
            last_updated_by, last_update_date, change_number
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            null, // auto-increment id
            productId,
            "system",
            new Date(product.meta.createdAt),
            "system",
            new Date(product.meta.updatedAt),
            1,
          ],
        );
      }
    }

    // Insert into reviews table
    if (product.reviews && product.reviews.length > 0) {
      for (const review of product.reviews) {
        await connection.execute(
          `
          INSERT INTO reviews (
            review_id, product_id, review_rating, review_comment, 
            review_date, created_by, creation_date, last_updated_by, 
            last_update_date, change_number
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            null, // auto-increment id
            productId,
            review.rating,
            review.comment,
            new Date(review.date),
            review.reviewerName,
            new Date(review.date),
            review.reviewerName,
            new Date(review.date),
            1,
          ],
        );
      }
    }

    // Insert into images table
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        await connection.execute(
          `
          INSERT INTO images (
            image_id, product_id, image_data, thumbnail, created_by, 
            creation_date, last_updated_by, last_update_date, change_number
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            null, // auto-increment id
            productId,
            image,
            product.thumbnail,
            "system",
            new Date(product.meta.createdAt),
            "system",
            new Date(product.meta.updatedAt),
            1,
          ],
        );
      }
    }

    await connection.commit();
    console.log("Inserted product:", product.title);
  } catch (err) {
    await connection.rollback();
    console.error("Failed to insert product:", err);
  } finally {
    connection.release();
  }
}

// Fetch all products from the DummyJSON API and insert into MySQL
axios
  .get("https://dummyjson.com/products?limit=1000")
  .then(async (response) => {
    const products = response.data.products;

    for (const product of products) {
      await insertProductData(product);
    }
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
  })
  .finally(() => {
    // Close the MySQL pool after all inserts
    pool.end();
  });
