// const axios = require("axios");
// const mysql = require("mysql2");

// // Create a MySQL connection
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "ecommerce",
// });

// // Function to insert category data into MySQL
// const insertCategory = (category) => {
//   const query = `
//     INSERT INTO category (
//       category_name, created_by, creation_date, last_updated_by, last_update_date, change_number
//     ) VALUES (?, ?, ?, ?, ?, ?)
//   `;

//   // Set default values for other fields
//   const createdBy = "admin"; // Replace with actual value or user
//   const creationDate = new Date(); // Current date and time
//   const lastUpdatedBy = "admin"; // Replace with actual value or user
//   const lastUpdateDate = new Date(); // Current date and time
//   const changeNumber = 1; // Initial change number

//   connection.query(
//     query,
//     [
//       category,
//       createdBy,
//       creationDate,
//       lastUpdatedBy,
//       lastUpdateDate,
//       changeNumber,
//     ],
//     (err, results) => {
//       if (err) {
//         console.error("Failed to insert category:", err);
//       } else {
//         console.log("Inserted category:", category);
//       }
//     },
//   );
// };

// // Fetch categories from the API
// axios
//   .get("https://dummyjson.com/products/category-list")
//   .then((response) => {
//     const categories = response.data;

//     if (Array.isArray(categories)) {
//       // Insert each category into MySQL
//       categories.forEach((category) => {
//         insertCategory(category);
//       });
//     } else {
//       console.error("Unexpected response format:", response.data);
//     }
//   })
//   .catch((error) => {
//     console.error("Error fetching categories:", error);
//   })
//   .finally(() => {
//     // Close the MySQL connection after all inserts
//     connection.end();
//   });

const axios = require("axios");
const mysql = require("mysql2");

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommerce",
});

// Function to insert data into products table
const insertProduct = (product) => {
  return new Promise((resolve, reject) => {
    const productQuery = `
      INSERT INTO products (
        product_title, product_description, category_id, product_discount, product_rating,
        product_brand, product_sku, product_weight,  product_warranty, product_shipping,
        product_availability, product_return, product_minimum, product_thumbnail, barcode, qrcode, created_by, creation_date, last_updated_by, last_update_date, change_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    const categoryQuery = `SELECT category_id FROM category WHERE category_name = ?`;

    connection.query(categoryQuery, [product.category], (err, results) => {
      if (err) return reject(err);

      const categoryId = results.length ? results[0].category_id : null;

      const availability =
        product.availabilityStatus === "In Stock"
          ? 1
          : product.availabilityStatus === "Low Stock"
            ? 2
            : 0;

      connection.query(
        productQuery,
        [
          product.title,
          product.description,
          categoryId,
          product.discountPercentage,
          product.rating,
          product.brand,
          product.sku,
          product.weight,
          product.warrantyInformation,
          product.shippingInformation,
          availability,
          product.returnPolicy,
          product.minimumOrderQuantity,
          product.thumbnail,
          product.meta.barcode || null,
          product.meta.qrCode || null,
          "admin", // created_by
          new Date(product.meta.createdAt),
          "admin", // last_updated_by
          new Date(product.meta.updatedAt),
          1, // change_number
        ],
        (err, results) => {
          if (err) return reject(err);

          resolve(results.insertId);
        },
      );
    });
  });
};

const insertProductMaster = (productId, product) => {
  return new Promise((resolve, reject) => {
    const productMasterQuery = `
      INSERT INTO products_master (
        product_id, product_price, product_stock, created_by, creation_date, last_updated_by, last_update_date, change_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Ensure price is a number and has two decimal places
    const price = parseFloat(product.price).toFixed(2);

    connection.query(
      productMasterQuery,
      [
        productId,
        price, // Use the parsed and formatted price
        product.stock,
        "admin", // created_by
        new Date(),
        "admin", // last_updated_by
        new Date(),
        1, // change_number
      ],
      (err, results) => {
        if (err) {
          console.error("Error inserting product master:", err);
          return reject(err);
        }
        console.log(
          `Inserted product master for product ID ${productId} with price ${price}`,
        );
        resolve();
      },
    );
  });
};
// Function to insert images
const insertImages = (productId, images) => {
  return Promise.all(
    images.map((image) => {
      return new Promise((resolve, reject) => {
        const imageQuery = `
          INSERT INTO images (product_id, image_data, created_by, creation_date, last_updated_by, last_update_date, change_number)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(
          imageQuery,
          [productId, image, "admin", new Date(), "admin", new Date(), 1],
          (err, results) => {
            if (err) return reject(err);
            resolve();
          },
        );
      });
    }),
  );
};

// Function to insert dimensions
const insertDimensions = (productId, dimensions) => {
  return new Promise((resolve, reject) => {
    const dimensionsQuery = `
      INSERT INTO dimensions (product_id, height, width, depth, created_by, creation_date, last_updated_by, last_update_date, change_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      dimensionsQuery,
      [
        productId,
        dimensions.height,
        dimensions.width,
        dimensions.depth,
        "admin",
        new Date(),
        "admin",
        new Date(),
        1,
      ],
      (err, results) => {
        if (err) return reject(err);
        resolve();
      },
    );
  });
};

// Function to insert reviews
const insertReviews = (productId, reviews) => {
  return Promise.all(
    reviews.map((review) => {
      return new Promise((resolve, reject) => {
        const reviewQuery = `
          INSERT INTO reviews (product_id, review_rating, review_comment, review_date, created_by, creation_date, last_updated_by, last_update_date, change_number)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(
          reviewQuery,
          [
            productId,
            review.rating,
            review.comment,
            new Date(review.date),
            "admin",
            new Date(),
            "admin",
            new Date(),
            1,
          ],
          (err, results) => {
            if (err) return reject(err);
            resolve();
          },
        );
      });
    }),
  );
};

// Function to insert tags
const insertTags = (productId, tags) => {
  return Promise.all(
    tags.map((tag) => {
      return new Promise((resolve, reject) => {
        const tagQuery = `
          INSERT INTO product_tags (tags_name, created_by, creation_date, last_updated_by, last_update_date, change_number)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        connection.query(
          tagQuery,
          [tag, "admin", new Date(), "admin", new Date(), 1],
          (err, results) => {
            if (err) return reject(err);

            const tagId = results.insertId;

            const tagsRelationQuery = `
              INSERT INTO tags (tags_id, product_id, created_by, creation_date, last_updated_by, last_update_date, change_number)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            connection.query(
              tagsRelationQuery,
              [tagId, productId, "admin", new Date(), "admin", new Date(), 1],
              (err, results) => {
                if (err) return reject(err);
                resolve();
              },
            );
          },
        );
      });
    }),
  );
};

// Fetch all products from the DummyJSON API
// In the main product insertion loop
axios
  .get("https://dummyjson.com/products?limit=1000")
  .then((response) => {
    const products = response.data.products;

    // Insert each product and related data into MySQL
    products.forEach((product) => {
      console.log(
        `Processing product: ${product.title}, Price: ${product.price}`,
      );
      insertProduct(product)
        .then((productId) => {
          console.log(`Inserted product with ID: ${productId}`);
          return Promise.all([
            insertProductMaster(productId, product),
            insertDimensions(productId, product.dimensions),
            insertReviews(productId, product.reviews),
            insertTags(productId, product.tags),
            insertImages(productId, product.images),
          ]);
        })
        .then(() => {
          console.log(`Completed insertion for product: ${product.title}`);
        })
        .catch((err) => {
          console.error(`Failed to insert product ${product.title}:`, err);
        });
    });
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
  });
