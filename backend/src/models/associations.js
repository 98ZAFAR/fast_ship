const CartItem = require("./cartItemModel");
const Product = require("./productModel");
const SellerApplication = require("./sellerApplicationModel");
const SellerProfile = require("./sellerProfileModel");
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

User.hasOne(SellerApplication, {
  foreignKey: "userId",
  as: "sellerApplication",
  onDelete: "CASCADE",
});
SellerApplication.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasOne(SellerProfile, {
  foreignKey: "userId",
  as: "sellerProfile",
  onDelete: "CASCADE",
});
SellerProfile.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
