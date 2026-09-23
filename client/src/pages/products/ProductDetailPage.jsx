import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice"; // ✅ add kiya
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, IndianRupee, Star } from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const { product, loading } = useSelector((state) => state.products);
  const { isLoggedIn } = useSelector((state) => state.auth); // ✅ login check ke liye
  const { mutating: cartMutating } = useSelector((state) => state.cart); // ✅ apne cartSlice ke hisaab se — agar "loading" hai to niche batao

  const [currentidx, setCurrentidx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null); // ✅ selected variant track karne ke liye

  if (loading || !product) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const hasMultipleImages = product.images?.length > 1;

  const handlePrev = () => {
    setCurrentidx((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentidx((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1,
    );
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!selectedVariant) return; // safety — button already disabled hoga
    if (cartMutating) return;

    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
        size: selectedVariant.size,
        color: selectedVariant.color,
      }),
    );
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto px-4 py-8 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* LEFT — Image carousel */}
      <div className="w-full">
        <div className="group relative w-full aspect-square sm:aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden">
          <img
            src={product.images?.[currentidx]?.url}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {hasMultipleImages && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {hasMultipleImages && (
          <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 overflow-x-auto">
            {product.images.map((img, index) => (
              <button
                key={img._id}
                onClick={() => setCurrentidx(index)}
                className={`shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden border-2 transition-all ${
                  currentidx === index ? "border-black" : "border-gray-200"
                }`}
              >
                <img
                  src={img.url}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT — Product details */}
      <div className="lg:sticky lg:top-20 lg:self-start flex flex-col gap-4 sm:gap-5">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            {product.brand}
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold mt-1">
            {product.name}
          </h1>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Star size={16} className="fill-yellow-400 text-yellow-400" />
          <span>{product.rating}</span>
          <span>({product.numReviews} reviews)</span>
        </div>

        <p className="flex items-center text-xl sm:text-2xl font-medium">
          <IndianRupee size={20} />
          {product.price}
        </p>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {product.description}
        </p>

        {/* Variants — ab clickable, selection track ho raha hai */}
        {product.variants?.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Available options</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => {
                const isSelected = selectedVariant?._id === variant._id;
                const outOfStock = variant.stock === 0;

                return (
                  <button
                    key={variant._id}
                    type="button"
                    disabled={outOfStock}
                    onClick={() => setSelectedVariant(variant)}
                    className={`text-xs sm:text-sm border rounded-full px-3 py-1.5 transition-colors ${
                      outOfStock ?
                        "border-gray-200 text-gray-300 line-through cursor-not-allowed"
                      : isSelected ? "bg-black text-white border-black"
                      : "border-gray-300 hover:border-black"
                    }`}
                  >
                    {variant.color} / {variant.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || cartMutating}
          className="mt-2 w-full sm:w-auto h-12 px-8 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {cartMutating ?
            "Adding..."
          : selectedVariant ?
            "Add to Cart"
          : "Select an option"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
