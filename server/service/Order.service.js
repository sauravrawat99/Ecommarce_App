const Cart = require("../models/cart.model");
const Order = require("../models/model.Order");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

exports.createOrder = async (userId, shippingAddress, paymentMethod) => {
  // cart fetech
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name images price stock",
  );
  if (!cart || cart.items.length === 0) {
    throw new ApiError("Cart is empty", 400);
  }

  //   order items
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name, // snapshot
    image: item.product.images[0]?.url,
    quantity: item.quantity,
    price: item.product.price,
  }));

  // Step 3 — Price calculate karo
  const itemsPrice = cart.totalPrice;
  const taxPrice = Math.round(itemsPrice * 0.18);
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // Step 4 — Order banao
  const order = await Order.create({
    user: userId,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // Step 5 — Cart clear karo
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  // Step 6 — Stock update karo
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  return order;
};

exports.getMyOrders = async (userId) => {
  return await Order.find({ user: userId })
    .populate("orderItems.product", "name images")
    .sort({ createdAt: -1 });
};

exports.getOrderById = async (orderId) => {
  const order = await Order.findById(orderId)

    .populate("orderItems.product", "name images price")
    .populate("user", "name email");
  console.log(orderId);

  if (!order) {
    throw new ApiError("order not found", 404);
  }
  return order;
};
exports.cancelOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError("Order not found", 404);

  if (order.orderStatus !== "pending")
    throw new ApiError("Only pending orders can be cancelled", 400);

  order.orderStatus = "cancelled";

  // Stock wapas karo
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: +item.quantity },
    });
  }
  return await order.save();
};

exports.updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: status },
    { returnDocument: "after" },
  );
  if (!order) throw new ApiError("Order not found", 404);
  return order;
};
