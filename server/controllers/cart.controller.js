const AsyncHandle = require("../utils/AsyncHandle");
const ApiError = require("../utils/ApiError");
const {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = require("../service/cart.service");
const {
  validateAddToCart,
  validateUpdateQuantity,
  validateProductId,
} = require("../validator/card.validator");

// Cart dekho
exports.getCart = AsyncHandle(async (req, res) => {
  const cart = await getCart(req.user.id);
  res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    cart,
  });
});

// Item add karo
exports.addToCart = AsyncHandle(async (req, res) => {
  const { productId, quantity = 1, size, color } = req.body; // ✅ size, color liye
  validateAddToCart({ productId, quantity });

  const cart = await addToCart(req.user.id, productId, quantity, size, color);
  res.status(200).json({
    success: true,
    message: "Product added to cart",
    cart,
  });
});

// Item remove karo — ✅ size/color query se lena hoga (body DELETE me generally nahi bhejte)
exports.removeFromCart = AsyncHandle(async (req, res) => {
  const { productId } = req.params;
  const { size, color } = req.query; // ✅ frontend ko query params se bhejna hoga
  validateProductId(productId);

  const cart = await removeFromCart(req.user.id, productId, size, color);
  res.status(200).json({
    success: true,
    message: "Product removed from cart",
    cart,
  });
});

// Quantity update karo
exports.updateQuantity = AsyncHandle(async (req, res) => {
  const { productId } = req.params;
  const { quantity, size, color } = req.body; // ✅ size, color liye

  validateProductId(productId);
  validateUpdateQuantity({ quantity });

  const cart = await updateQuantity(
    req.user.id,
    productId,
    quantity,
    size,
    color,
  );
  res.status(200).json({
    success: true,
    message: "Quantity updated",
    cart,
  });
});

// Cart clear karo
exports.clearCart = AsyncHandle(async (req, res) => {
  await clearCart(req.user.id);
  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
  });
});
