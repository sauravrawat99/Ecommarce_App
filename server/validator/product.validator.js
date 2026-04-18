const ApiError = require("../utils/ApiError");

const validateCreateProduct = (body) => {
  const { name, price, stock, description } = body;

  if (!name) throw new ApiError("Name is required", 400);
  if (!price) throw new ApiError("Price is required", 400);
  if (!description) throw new ApiError("Description is required", 400);
  if (price < 0) throw new ApiError("Price cannot be negative", 400);
  if (stock < 0) throw new ApiError("Stock cannot be negative", 400);
};

module.exports = { validateCreateProduct };
