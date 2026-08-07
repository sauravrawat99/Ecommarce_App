import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { createOrder } from "../redux/slices/orderSlice";
import { createPayment, verifyPayment } from "../redux/slices/paymentSlice";

const Address = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.address.trim()) newErrors.address = "Address zaroori hai";
    if (!formData.city.trim()) newErrors.city = "City zaroori hai";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode zaroori hai";
    else if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Valid 6-digit pincode daalein";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ───── Razorpay checkout popup kholne wala function ─────
  const openRazorpayCheckout = (
    razorpayOrder,
    razorpayKey,
    internalOrderId,
  ) => {
    const options = {
      key: razorpayKey,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order_id: razorpayOrder.id, // Razorpay ka order_id (backend se aaya)
      name: "ShopKart",
      description: "Order Payment",
      handler: async (response) => {
        // response mein Razorpay se ye milta hai:
        // razorpay_order_id, razorpay_payment_id, razorpay_signature
        try {
          await dispatch(
            verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: internalOrderId, // apna Order document ka _id
            }),
          ).unwrap();

          toast.success("Payment successful! Order confirmed 🎉");
          navigate("/profile"); // ya "/orders" jab wo page bane
        } catch (err) {
          toast.error(err || "Payment verification failed");
          setProcessing(false);
        }
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
      },
      theme: {
        color: "#4F46E5", // Indigo — design system se match
      },
      modal: {
        // Agar user popup band kar de bina pay kiye
        ondismiss: () => {
          setProcessing(false);
          toast.error("Payment cancelled");
        },
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setProcessing(true);

    const shippingAddress = {
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: Number(formData.pincode),
    };

    try {
      // ───── Step 1: Order create karo ─────
      const orderResult = await dispatch(
        createOrder({ shippingAddress, paymentMethod }),
      ).unwrap();

      const newOrder = orderResult.order;

      // ───── Step 2a: COD hai to seedha done ─────
      if (paymentMethod === "cod") {
        toast.success("Order placed successfully! 🎉");
        navigate("/profile");
        return;
      }

      // ───── Step 2b: Card/UPI hai to Razorpay trigger karo ─────
      const paymentResult = await dispatch(
        createPayment(newOrder._id),
      ).unwrap();

      openRazorpayCheckout(
        paymentResult.razorpayOrder,
        paymentResult.key,
        newOrder._id,
      );
    } catch (err) {
      toast.error(err || "Something went wrong, please try again");
      setProcessing(false);
    }
  };

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
        <p className="text-sm text-gray-500">
          Cart khaali hai — checkout ke liye pehle products add karein.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-4 sm:px-6 md:px-12 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ───── Shipping Form ───── */}
          <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl shadow-sm p-5 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
              Shipping Address
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House no, street, area"
                error={errors.address}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="City"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  error={errors.city}
                />
                <Input
                  label="State"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter your state (optional)"
                />
              </div>

              <Input
                label="Pincode"
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                error={errors.pincode}
              />

              {/* ───── Payment Method ───── */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["card", "upi", "cod"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2.5 rounded-xl border text-sm font-medium capitalize transition-colors
                        ${
                          paymentMethod === method ?
                            "border-indigo-600 bg-indigo-50 text-indigo-600"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                    >
                      {method === "cod" ? "Cash on Delivery" : method}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full lg:hidden"
                disabled={processing}
              >
                {processing ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </div>

          {/* ───── Order Summary ───── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-5 sm:p-6 lg:sticky lg:top-24">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate pr-2">
                      {item.product?.name || "Unavailable"} × {item.quantity}
                    </span>
                    <span className="text-gray-900 font-medium shrink-0">
                      ₹
                      {(
                        (item.product?.price || 0) * item.quantity
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 mb-6">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-indigo-600">
                  ₹{cart.totalPrice?.toLocaleString()}
                </span>
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                className="w-full hidden lg:block"
                disabled={processing}
              >
                {processing ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
