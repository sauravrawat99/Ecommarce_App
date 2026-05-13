const ApiError = require("../utils/ApiError");

exports.validatorCategory = ({ name }) => {
  if (!name) throw new ApiError("category not found", 400);
};
