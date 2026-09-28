const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Address = require("../models/address.model");
const ApiError = require("../utils/ApiError");

// ───── 1. Create Order ─────
exports.createOrder = async (userId, shippingAddressId, paymentMethod) => {
  // Cart fetch
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name images price stock",
  );
  if (!cart || cart.items.length === 0) {
    throw new ApiError("Cart is empty", 400);
  }

  // Address fetch (ownership check ke saath)
  const selectedAddress = await Address.findOne({
    _id: shippingAddressId,
    user: userId,
  });
  if (!selectedAddress) {
    throw new ApiError("Address not found", 404);
  }

  // Stock check: order se pehle hi verify karo
  for (const item of cart.items) {
    if (!item.product) {
      throw new ApiError("A product in your cart is no longer available", 400);
    }
    if (item.product.stock < item.quantity) {
      throw new ApiError(
        `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}`,
        400,
      );
    }
  }

  // Order items
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images?.[0]?.url,
    quantity: item.quantity,
    price: item.product.price,
  }));

  // Prices
  const itemsPrice = cart.totalPrice;
  const taxPrice = Math.round(itemsPrice * 0.18);
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // Order create (reference + snapshot)
  const order = await Order.create({
    user: userId,
    orderItems,
    shippingAddress: selectedAddress._id,
    shippingSnapshot: {
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

  // Cart clear
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  // Stock update
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  return order;
};

// ───── 2. Get logged-in user ke saare orders ─────
exports.getMyOrders = async (userId) => {
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  return orders;
};

// ───── 3. Single order by ID ─────
exports.getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  return order;
};

// ───── 4. Cancel order ─────
exports.cancelOrder = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  if (order.orderStatus === "cancelled") {
    throw new ApiError("Order is already cancelled", 400);
  }

  if (["shipped", "delivered"].includes(order.orderStatus)) {
    throw new ApiError(
      `Order cannot be cancelled once it is ${order.orderStatus}`,
      400,
    );
  }

  // Stock wapas restore karo
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  order.orderStatus = "cancelled";
  await order.save();

  return order;
};

// ───── 5. Update order status (admin) ─────
exports.updateOrderStatus = async (orderId, status) => {
  const validStatuses = ["processing", "shipped", "delivered", "cancelled"];

  if (!validStatuses.includes(status)) {
    throw new ApiError(
      `Invalid status. Allowed: ${validStatuses.join(", ")}`,
      400,
    );
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  if (order.orderStatus === "delivered" || order.orderStatus === "cancelled") {
    throw new ApiError(`Order is already ${order.orderStatus}`, 400);
  }

  // Cancel via admin: stock restore karo
  if (status === "cancelled") {
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
  }

  order.orderStatus = status;
  if (status === "delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save();

  return order;
};