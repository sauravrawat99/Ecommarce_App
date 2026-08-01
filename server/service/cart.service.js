const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/ApiError");

// ✅ Improvement 1 — DB calls nahi, populated items se calculate karo
const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);
};

// ✅ Populate helper — baar baar likhna nahi padega
const populateCart = (cart) => {
  return cart.populate("items.product", "name price images stock");
};

// Cart fetch karo
exports.getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name price images stock",
  );
  if (!cart) throw new ApiError("Cart is empty", 404);

  // ✅ Deleted products ke orphan items ko cart se hi hata do
  const originalLength = cart.items.length;
  cart.items = cart.items.filter((item) => item.product !== null);

  // Agar kuch remove hua, total recalc karke DB mein save karo
  if (cart.items.length !== originalLength) {
    cart.totalPrice = calculateTotal(cart.items);
    await cart.save();
  }

  return cart;
};

// Cart mein item add karo
exports.addToCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  // ✅ Improvement 2 — Better stock error message
  if (product.stock < quantity)
    throw new ApiError(`Only ${product.stock} items left in stock!`, 400);

  let cart = await Cart.findOne({ user: userId });

  // Cart nahi hai → naya banao
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity }],
      totalPrice: product.price * quantity,
    });
    // ✅ Improvement 3 — Create ke baad populate karo
    return await populateCart(cart);
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();

  // ✅ Improvement 4 — Save ke baad populate karo
  const populated = await populateCart(cart);
  populated.totalPrice = calculateTotal(populated.items); // ✅ DB calls nahi!
  await populated.save();

  return populated;
};

// Item remove karo
exports.removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError("Cart not found", 404);

  const itemExists = cart.items.some(
    (item) => item.product.toString() === productId,
  );
  // ✅ Improvement 5 — Item exist karta hai check karo
  if (!itemExists) throw new ApiError("Item not found in cart", 404);

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  await cart.save();
  return await populateCart(cart);
};

// Quantity update karo
exports.updateQuantity = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError("Cart not found", 404);

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );
  if (itemIndex === -1) throw new ApiError("Item not in cart", 404);

  const product = await Product.findById(productId);
  if (product.stock < quantity)
    throw new ApiError(`Only ${product.stock} items left in stock!`, 400);

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  // ✅ Populate karo aur total update karo
  const populated = await populateCart(cart);
  populated.totalPrice = calculateTotal(populated.items);
  await populated.save();

  return populated;
};

// ✅ Improvement 6 — findOneAndUpdate use karo — clean!
exports.clearCart = async (userId) => {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { items: [], totalPrice: 0 },
    { returnDocument: "after" },
  );
  if (!cart) throw new ApiError("Cart not found", 404);
  return cart;
};
