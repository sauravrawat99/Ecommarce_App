const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/ApiError");

const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);
};

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

  const originalLength = cart.items.length;
  cart.items = cart.items.filter((item) => item.product !== null);

  if (cart.items.length !== originalLength) {
    cart.totalPrice = calculateTotal(cart.items);
    await cart.save();
  }

  return cart;
};

// Cart mein item add karo
exports.addToCart = async (userId, productId, quantity, size, color) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  if (product.stock < quantity)
    throw new ApiError(`Only ${product.stock} items left in stock!`, 400);

  let cart = await Cart.findOne({ user: userId });

  // Cart nahi hai → naya banao
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity, size, color }], // ✅ size/color add kiya
      totalPrice: product.price * quantity,
    });
    return await populateCart(cart);
  }

  // ✅ productId + size + color, teeno match hone chahiye — tabhi same variant maana jayega
  const itemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color,
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, size, color }); // ✅ naya variant
  }

  await cart.save();

  const populated = await populateCart(cart);
  const totalPrice = calculateTotal(populated.items);

  // ✅ total original cart document pe update karo, populated pe nahi
  cart.totalPrice = totalPrice;
  await cart.save();

  populated.totalPrice = totalPrice; // response me sahi total dikhe
  return populated;
};

// Item remove karo — ✅ size/color se specific variant remove hoga
exports.removeFromCart = async (userId, productId, size, color) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError("Cart not found", 404);

  const itemExists = cart.items.some(
    (item) =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color,
  );
  if (!itemExists) throw new ApiError("Item not found in cart", 404);

  cart.items = cart.items.filter(
    (item) =>
      !(
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
      ),
  );

  await cart.save();

  const populated = await populateCart(cart);
  populated.totalPrice = calculateTotal(populated.items);
  cart.totalPrice = populated.totalPrice;
  await cart.save();

  return populated;
};

// Quantity update karo — ✅ size/color se specific variant update hoga
exports.updateQuantity = async (userId, productId, quantity, size, color) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError("Cart not found", 404);

  const itemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color,
  );
  if (itemIndex === -1) throw new ApiError("Item not in cart", 404);

  const product = await Product.findById(productId);
  if (product.stock < quantity)
    throw new ApiError(`Only ${product.stock} items left in stock!`, 400);

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  const populated = await populateCart(cart);
  const totalPrice = calculateTotal(populated.items);
  cart.totalPrice = totalPrice;
  await cart.save();

  populated.totalPrice = totalPrice;
  return populated;
};

exports.clearCart = async (userId) => {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { items: [], totalPrice: 0 },
    { returnDocument: "after" },
  );
  if (!cart) throw new ApiError("Cart not found", 404);
  return cart;
};
