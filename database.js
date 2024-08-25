const axios = require("axios");
const mysql = require("mysql2");

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "products_db",
});

// Function to insert product data into MySQL
const insertProduct = (product) => {
  const query = `
    INSERT INTO products (
      id, title, description, category, price, discountPercentage, rating, stock, tags, brand, sku, weight, dimensions,
      warrantyInformation, shippingInformation, availabilityStatus, returnPolicy, minimumOrderQuantity, createdAt, 
      updatedAt, barcode, qrCode, images, thumbnail
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [
      product.id,
      product.title,
      product.description,
      product.category,
      product.price,
      product.discountPercentage,
      product.rating,
      product.stock,
      JSON.stringify(product.tags),
      product.brand,
      product.sku,
      product.weight,
      JSON.stringify(product.dimensions),
      product.warrantyInformation,
      product.shippingInformation,
      product.availabilityStatus,
      product.returnPolicy,
      product.minimumOrderQuantity,
      new Date(product.meta.createdAt),
      new Date(product.meta.updatedAt),
      product.meta.barcode,
      product.meta.qrCode,
      JSON.stringify(product.images),
      product.thumbnail,
    ],
    (err, results) => {
      if (err) {
        console.error("Failed to insert product:", err);
      } else {
        console.log("Inserted product:", product.title);
      }
    },
  );
};

// Fetch all products from the DummyJSON API
axios
  .get("https://dummyjson.com/products?limit=1000")
  .then((response) => {
    const products = response.data.products;

    // Insert each product into MySQL
    products.forEach((product) => {
      insertProduct(product);
    });
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
  })
  .finally(() => {
    // Close the MySQL connection after all inserts
    connection.end();
  });
