const AsyncHandler = require("../utils/AsyncHandle");
const ApiError = require("../utils/ApiError");
const {
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  deleteUser,
  getDashboardStats,
} = require("../service/admin.service");

exports.getAllOrders = AsyncHandler(async (req, res) => {
  const orders = await getAllOrders();
  res.status(200).json({
    success: true,
    message: "All orders fetched successfully", // ✅
    count: orders.length,
    orders,
  });
});

exports.updateOrderStatus = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await updateOrderStatus(id, status);

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order,
  });
});

exports.getAllUsers = AsyncHandler(async (req, res) => {
  const users = await getAllUsers();
  res
    .status(200)
    .json({ success: true, message: "User fetch successfully", users });
});

exports.deleteUser = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const user = await deleteUser(id);
  res
    .status(200)
    .json({ success: true, message: "User delete successfully", user });
});

exports.getDashboardStats = AsyncHandler(async (req, res) => {
  const stats = await getDashboardStats();
  res
    .status(200)
    .json({ success: true, message: "Stats fetch successfully", stats });
});
