const { verifyToken } = require("../utils/validate");

const validateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access!",
      });

    const user = verifyToken(token);

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid Token!",
      error,
    });
    console.error(error);
  }
};

module.exports = validateUser;
