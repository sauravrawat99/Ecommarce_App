const ApiError = require("../utils/ApiError");

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError("Admin only!", 403);
  }

  next();
};
