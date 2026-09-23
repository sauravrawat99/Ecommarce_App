import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  updateQuantity,
  removeFromCart,
} from "../redux/slices/cartSlice";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { ShoppingBag, PackageX, Minus, Plus, Trash2 } from "lucide-react";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleIncrease = (item) => {
    dispatch(
      updateQuantity({
        productId: item.product._id,
        quantity: item.quantity + 1,
        size: item.size, // ✅ add
        color: item.color, // ✅ add
      }),
    );
  };

  const handleDecrease = (item) => {
    if (item.quantity <= 1) return;
    dispatch(
      updateQuantity({
        productId: item.product._id,
        quantity: item.quantity - 1,
        size: item.size, // ✅ add
        color: item.color, // ✅ add
      }),
    );
  };

  const handleRemove = (item) => {
    dispatch(
      removeFromCart({
        productId: item.product._id,
        size: item.size, // ✅ add
        color: item.color, // ✅ add
      }),
    );
  };

  // ───── Loading ─────
  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <Spinner size="lg" color="indigo" />
      </div>
    );
  }

  // ───── Error ─────
  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
        <p className="text-sm text-red-500 text-center">{error}</p>
      </div>
    );
  }

  // ───── Empty Cart ─────
  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-8 sm:p-12 text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="text-indigo-600" size={28} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Your cart is empty
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Kuch products add karo, phir yahan dikhenge.
          </p>
          <Link to="/products">
            <Button className="w-full">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasUnavailableItems = cart.items.some((item) => !item.product);

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-4 sm:px-6 md:px-12 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Your Cart
          <span className="text-gray-400 font-normal text-lg ml-2">
            ({cart.items.length} {cart.items.length === 1 ? "item" : "items"})
          </span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ───── Items List ───── */}
          <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl shadow-sm p-4 sm:p-6">
            {cart.items.map((item) => {
              if (!item.product) {
                return (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 py-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <PackageX className="text-gray-400" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-red-500 font-medium">
                        This product is no longer available
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                );
              }

              const { name, price, images } = item.product;

              return (
                <div
                  key={item._id}
                  className="flex items-center gap-3 sm:gap-4 py-4 border-b border-gray-100 last:border-0"
                >
                  <img
                    src={images?.[0]?.url || "/placeholder.png"}
                    alt={name}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl bg-gray-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                      {name}
                    </h2>
                    {(item.size || item.color) && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.color && (
                          <span className="capitalize">{item.color}</span>
                        )}
                        {item.size && item.color && " · "}
                        {item.size && <span>Size {item.size}</span>}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                      ₹{price?.toLocaleString()}
                    </p>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => handleDecrease(item)}
                        disabled={loading || item.quantity <= 1}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrease(item)}
                        disabled={loading}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                      >
                        <Plus size={14} />
                      </button>

                      <button
                        onClick={() => handleRemove(item)}
                        disabled={loading}
                        className="ml-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-gray-900 shrink-0">
                    ₹{(price * item.quantity).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ───── Order Summary ───── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-5 sm:p-6 lg:sticky lg:top-24">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cart.totalPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 mb-6">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-indigo-600">
                  ₹{cart.totalPrice?.toLocaleString()}
                </span>
              </div>

              {hasUnavailableItems && (
                <p className="text-xs text-red-500 text-center mb-3">
                  Kuch items available nahi hain — checkout se pehle remove
                  karein
                </p>
              )}

              <Button
                className="w-full"
                onClick={handleCheckout}
                disabled={loading || hasUnavailableItems}
              >
                {loading ?
                  <Spinner size="sm" color="white" />
                : "Buy Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
