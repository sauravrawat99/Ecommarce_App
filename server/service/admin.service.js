const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/ApiError");

exports.getAllOrders = async () => {
  const order = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  return order;
};

exports.updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { $set: { orderStatus: status } },
    { returnDocument: "after" },
  );
  if (!order) throw new ApiError("Order not found", 404);
  return order;
};

exports.getAllUsers = async () => {
  const users = await User.find().select("-password");
  if (!users) {
    throw new ApiError("Users not found");
  }
  return users;
};

exports.deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ApiError("User is not found", 401);
  }
  return user;
};

exports.getDashboardStats = async () => {
  // Total counts
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const revenue = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  const recentOrders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  const pendingOrders = await Order.countDocuments({
    orderStatus: "pending",
  });

  return {
    totalOrders,
    totalUsers,
    totalProducts,
    totalRevenue: revenue[0]?.total || 0,
    pendingOrders,
    recentOrders,
  };
};
