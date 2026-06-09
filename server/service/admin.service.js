const Order = require("../models/model.Order");
const ApiError = require("../utils/ApiError");

exports.getAllOrders = async () => {
  const order = await Order.find()
    .populate("user", "name email")
    .sort({ createAt: -1 });
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
