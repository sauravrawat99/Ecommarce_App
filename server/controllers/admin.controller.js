const AsyncHandler = require("../utils/AsyncHandle");
const ApiError = require("../utils/ApiError");
const { getAllOrders, updateOrderStatus } = require("../service/admin.service");

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
    // ✅ res
    success: true,
    message: "Order status updated successfully",
    order,
  });
});
