const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const productRoutes = require("./api/v1/products/routers/products");
const categoryRoutes = require("./api/v1/categories/routers/categories");
const colorRoutes = require("./api/v1/color/routers/color");
const userRoutes = require("./api/v1/user/routers/user");
const wishlistRoutes = require("./api/v1/wishlist/routers/wishlist");
const shippingRoutes = require("./api/v1/shipping/routers/shipping");
const orderRoutes = require("./api/v1/order/routers/order");
const adminUserRoutes = require("./api/v1/admin/user/routers/admin-user");
const adminOrderRoutes = require("./api/v1/admin/orders/routers/admin-orders");
const adminProductRoutes = require("./api/v1/admin/products/routers/admin-products");

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

app.use("/api/v1", productRoutes);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", colorRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", wishlistRoutes);
app.use("/api/v1", shippingRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", adminUserRoutes);
app.use("/api/v1", adminOrderRoutes);
app.use("/api/v1", adminProductRoutes);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
