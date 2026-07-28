const AsyncHandler = require("../utils/AsyncHandle");
const ApiError = require("../utils/ApiError");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../service/wishlist.service");

// Wishlist dekho
exports.getWishlist = AsyncHandler(async (req, res) => {
  const wishlist = await getWishlist(req.user.id);
  res.status(200).json({
    success: true,
    message: "Wishlist fetched successfully",
    wishlist,
  });
});

// Wishlist mein add karo
exports.addToWishlist = AsyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) throw new ApiError("Product ID required", 400);

  const wishlist = await addToWishlist(req.user.id, productId);
  res.status(200).json({
    success: true,
    message: "Product added to wishlist",
    wishlist,
  });
});

// Wishlist se remove karo
exports.removeFromWishlist = AsyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) throw new ApiError("Product ID required", 400);

  const wishlist = await removeFromWishlist(req.user.id, productId);
  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
    wishlist,
  });
});
