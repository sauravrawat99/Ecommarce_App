const User = require("../models/user.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/ApiError");

// Wishlist dekho
exports.getWishlist = async (userId) => {
  const user = await User.findById(userId).populate(
    "wishlist",
    "name price images",
  );
  if (!user) throw new ApiError("User not found", 404);
  return user.wishlist;
};

// Wishlist mein add karo
exports.addToWishlist = async (userId, productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  const user = await User.findById(userId);
  if (!user) throw new ApiError("User not found", 404);

  const exists = user.wishlist.includes(productId);
  if (exists) throw new ApiError("Already in wishlist", 400);

  user.wishlist.push(productId);
  await user.save();

  await user.populate("wishlist", "name price images");
  return user.wishlist;
};

// Wishlist se remove karo
exports.removeFromWishlist = async (userId, productId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError("User not found", 404);

  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);

  await user.save();

  await user.populate("wishlist", "name price images");
  return user.wishlist;
};
