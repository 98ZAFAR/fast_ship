require("dotenv").config();

const express = require("express");
const sequelize = require("./configs/dbConfig");
const cookieParser = require("cookie-parser");

const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const sellerRoutes = require("./src/routes/sellerRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const cartRoutes = require("./src/routes/cartRoutes");

require('./src/models/associations');

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);

sequelize
  .sync({})
  .then(() => {
    console.log("MySQL DB is connected...");
    app.listen(PORT, () => {
      console.log("App is runnning on port " + PORT);
    });
  })
  .catch((error) => console.log("DB Connection Error Occured : " + error));
