const AsyncHandle = require("../utils/AsyncHandle");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
} = require("../service/Order.service");

// Order banao
exports.newOrder = AsyncHandle(async (req, res) => {
  const userId = req.user.id;
  const { shippingAddress, paymentMethod } = req.body;

  const order = await createOrder(userId, shippingAddress, paymentMethod);
  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});

exports.MyOrders = AsyncHandle(async (req, res) => {
  const orders = await getMyOrders(req.user.id);
  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    count: orders.length,
    orders,
  });
});

exports.singleOrder = AsyncHandle(async (req, res) => {
  const { id } = req.params;
  const order = await getOrderById(id);
  res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    order,
  });
});

exports.cancelOrder = AsyncHandle(async (req, res) => {
  const { id } = req.params;
  const order = await cancelOrder(id);
  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    order,
  });
});

exports.updateOrderStatus = AsyncHandle(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) throw new ApiError("Status required", 400);

  const order = await updateOrderStatus(id, status);
  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order,
  });
});
