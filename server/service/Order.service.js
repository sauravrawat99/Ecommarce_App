const Cart = require("../models/cart.model");
const Order = require("../models/order.model"); // 👈 sahi path confirm karke likhna
const Product = require("../models/product.model");
const Address = require("../models/address.model"); // 👈 naya import
const ApiError = require("../utils/ApiError");

exports.createOrder = async (userId, shippingAddressId, paymentMethod) => {
  // Step 1 — Cart fetch karo
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name images price stock",
  );
  if (!cart || cart.items.length === 0) {
    throw new ApiError("Cart is empty", 400);
  }

  // Step 2 — Address fetch karo (snapshot banane ke liye)
  const selectedAddress = await Address.findOne({
    _id: shippingAddressId,
    user: userId, // security — user apna hi address use kar sake
  });
  if (!selectedAddress) {
    throw new ApiError("Address not found", 404);
  }

  // Step 3 — Order items banao
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images[0]?.url,
    quantity: item.quantity,
    price: item.product.price,
  }));

  // Step 4 — Price calculate karo
  const itemsPrice = cart.totalPrice;
  const taxPrice = Math.round(itemsPrice * 0.18);
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // Step 5 — Order banao (reference + snapshot dono)
  const order = await Order.create({
    user: userId,
    orderItems,
    shippingAddress: selectedAddress._id, // 👈 reference
    shippingSnapshot: {
      // 👈 frozen copy
      fullName: selectedAddress.fullName,
      phone: selectedAddress.phone,
      address: selectedAddress.address,
      city: selectedAddress.city,
      state: selectedAddress.state,
      pincode: selectedAddress.pincode,
    },
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // Step 6 — Cart clear karo
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  // Step 7 — Stock update karo
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  return order;
};
