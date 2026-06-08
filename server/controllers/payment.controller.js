// Yeh sab import nahi kiya!
const AsyncHandle = require("../utils/AsyncHandle");
const ApiError = require("../utils/ApiError");
const Order = require("../models/model.Order");
const {
  createRazorpayOrder,
  verifyPaymentService,
} = require("../service/payment.service");

exports.createPayment = AsyncHandle(async (req, res) => {
  const { orderId } = req.body;

  // Step 1 — Order fetch karo
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError("Order not found", 404);

  // Step 2 — Razorpay order banao
  const razorpayOrder = await createRazorpayOrder(order.totalPrice); // totalPrice do

  // Step 3 — Response bhejo
  res.status(200).json({
    success: true,
    razorpayOrder,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

exports.verifyPayment = AsyncHandle(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;

  // Step 1 — Verify karo
  const isValid = verifyPaymentService(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  );

  if (!isValid) throw new ApiError("Payment failed!", 400);

  // Step 2 — Order update karo
  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: "paid",
    paidAt: Date.now(),
    "paymentInfo.razorpay_order_id": razorpay_order_id,
    "paymentInfo.razorpay_payment_id": razorpay_payment_id,
    "paymentInfo.razorpay_signature": razorpay_signature,
  });

  res.status(200).json({
    success: true,
    message: "Payment successful",
  });
});
