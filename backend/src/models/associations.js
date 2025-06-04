const CartItem = require("./cartItemModel");
const Cart = require("./cartModel");
const Product = require("./productModel");
const SellerApplication = require("./sellerApplicationModel");
const SellerProfile = require("./sellerProfileModel");
const User = require("./userModel");

//Seller and Product Associations
User.hasMany(Product, {
  foreignKey: "sellerId",
  as: "products",
});
Product.belongsTo(User, {
  foreignKey: "sellerId",
  as: "seller",
});

//User and Cart Associations
User.hasOne(Cart, {
  foreignKey: "userId",
  as: "cart",
  onDelete: "CASCADE",
});
Cart.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

//Cart and CartItem Associations
Cart.hasMany(CartItem, {
  foreignKey: "cartId",
  as: "cartItems",
  onDelete: "CASCADE",
});

CartItem.belongsTo(Cart, {
  foreignKey: "cartId",
  as: "cart",
});

//CartItem and Product Associations
CartItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

Product.hasMany(CartItem, {
  foreignKey: "productId",
  as: "cartItems",
  onDelete: "CASCADE",
});

// User and SellerApplication Associations
User.hasOne(SellerApplication, {
  foreignKey: "userId",
  as: "sellerApplication",
  onDelete: "CASCADE",
});
SellerApplication.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// User and SellerProfile Associations
User.hasOne(SellerProfile, {
  foreignKey: "userId",
  as: "sellerProfile",
  onDelete: "CASCADE",
});
SellerProfile.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
