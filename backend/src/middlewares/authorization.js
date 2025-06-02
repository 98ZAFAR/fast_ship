const authorizeUser = (roles) => {
  return async (req, res, next) => {
    try {
      if (!roles || !roles.includes(req.user.role)) {
        return res.status(403).json({
          message:
            "Forbidden: You do not have permission to access this resource.",
        });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(500).json({
        message:
          "Internal Server Error: An error occurred during authorization.",
      });
    }
  };
};

const authorizeSeller = (req, res, next) => {
  return authorizeUser(["seller"])(req, res, next);
};

const authorizeAdmin = (req, res, next) => {
  return authorizeUser(["admin"])(req, res, next);
};

module.exports = {
  authorizeUser,
  authorizeSeller,
  authorizeAdmin,
};
