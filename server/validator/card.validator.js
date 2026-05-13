const ApiError = require("../utils/ApiError");

exports.validateAddToCart = ({ productId, quantity }) => {
  if (!productId) throw new ApiError("Product ID required", 400);
  if (quantity && quantity < 1)
    throw new ApiError("Quantity must be at least 1", 400);
};

exports.validateUpdateQuantity = ({ quantity }) => {
  if (!quantity) throw new ApiError("Quantity required", 400);
  if (quantity < 1) throw new ApiError("Quantity must be at least 1", 400);
};

exports.validateProductId = (productId) => {
  if (!productId) throw new ApiError("Product ID required", 400);
};
