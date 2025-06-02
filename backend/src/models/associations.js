const CartItem = require("./cartItemModel");
const Product = require("./productModel");
const User = require("./userModel");

User.hasMany(Product, {
  foreignKey: "sellerId",
  as: "products",
});
Product.belongsTo(User, {
  foreignKey: "sellerId",
  as: "seller",
});

User.hasMany(CartItem, {
  foreignKey: "userId",
  as: "cartItems",
  onDelete: "CASCADE",
});
CartItem.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Product.hasMany(CartItem, {
  foreignKey: "productId",
  as: "cartItems",
  onDelete: "CASCADE",
});

CartItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});
