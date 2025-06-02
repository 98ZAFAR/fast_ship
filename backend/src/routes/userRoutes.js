const express = require("express");
const {
  handleCreateUser,
  handleLoginUser,
  handleVerifyEmail,
  handleUpdateUser,
  handleGetUser,
  handleLogoutUser,
} = require("../controllers/userControllers");
const validateUser = require("../middlewares/authentication");
const router = express.Router();

router.post("/register", handleCreateUser);
router.post("/login", handleLoginUser);
router.get("/verify-email", handleVerifyEmail);
router.put("/update", validateUser, handleUpdateUser);
router.get("/me", validateUser, handleGetUser);
router.post("/logout", validateUser, handleLogoutUser);

module.exports = router;
