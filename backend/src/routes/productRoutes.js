const express = require("express");
const router = express.Router();
const {
  handleAddProduct,
  handleGetProducts,
  handleGetProductById,
  handleUpdateProduct,
  handleDeleteProduct,
} = require("../controllers/productControllers");

const {
  authorizeUser,
  authorizeSeller,
} = require("../middlewares/authorization");
const validateUser = require("../middlewares/authentication");

router.post("/add", validateUser, authorizeSeller, handleAddProduct);

router.get("/", handleGetProducts);
router.get("/:id", handleGetProductById);
router.put(
  "/:id",
  validateUser,
  authorizeUser(["seller", "admin"]),
  handleUpdateProduct
);
router.delete(
  "/:id",
  validateUser,
  authorizeUser(["seller", "admin"]),
  handleDeleteProduct
);
module.exports = router;