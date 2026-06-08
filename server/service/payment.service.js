const razorpay = require("../config/razorpay");
const crypto = require("crypto");

exports.createRazorpayOrder = async (amount) => {
  const options = {
    amount: amount * 100, // ← Razorpay paise mein leta hai!
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  return await razorpay.orders.create(options);
};

exports.verifyPaymentService = (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
) => {
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === razorpay_signature;
};
