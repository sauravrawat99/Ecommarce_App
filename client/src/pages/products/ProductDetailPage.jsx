import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchProductById } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import Button from "../../components/ui/Button";

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { product, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    // 1. Not logged in -> redirect to login instead of silently failing
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    // 2. Prevent double clicks while request is in flight
    if (isAdding) return;

    setIsAdding(true);
    try {
      // unwrap() throws if the thunk was rejected -> lands in catch below
      await dispatch(addToCart({ productId: product._id, quantity })).unwrap();
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      // err here is whatever rejectWithValue sent from the thunk
      toast.error(err || "Could not add item to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
        <p className="text-[#6e6e73] text-sm">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
        <p className="text-red-500 text-sm text-center">{error}</p>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length ? product.images : [{ url: "" }];
  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-6 px-4 sm:py-12 sm:px-6">
      <div
        className="max-w-5xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-sm p-4 sm:p-8 md:p-12 
                       grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12"
      >
        {/* ───── LEFT — Images ───── */}
        <div>
          <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-[#f5f5f7] aspect-square mb-3 sm:mb-4">
            <img
              src={images[selectedImage]?.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all
                    ${selectedImage === index ? "border-[#0071e3]" : "border-transparent"}`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ───── RIGHT — Details ───── */}
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-2">
            {product.name}
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#0071e3] mb-4 sm:mb-6">
            ₹{product.price?.toLocaleString()}
          </p>

          <p className="text-sm text-[#6e6e73] leading-relaxed mb-4 sm:mb-6">
            {product.description}
          </p>

          <div className="mb-4 sm:mb-6">
            {inStock ?
              <span className="text-sm text-green-600 font-medium">
                ✅ In Stock ({product.stock} available)
              </span>
            : <span className="text-sm text-red-500 font-medium">
                ❌ Out of Stock
              </span>
            }
          </div>

          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <span className="text-sm font-medium text-[#1d1d1f]">Quantity</span>
            <div className="flex items-center border border-gray-200 rounded-full">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-lg shrink-0"
              >
                −
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                className="w-9 h-9 flex items-center justify-center text-lg shrink-0"
              >
                +
              </button>
            </div>
          </div>

          <Button
            type="button"
            disabled={!inStock || isAdding}
            className="w-full mt-auto"
            onClick={handleAddToCart}
          >
            {!inStock ?
              "Out of Stock"
            : isAdding ?
              "Adding..."
            : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
