import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import Button from "../../components/ui/Button";

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { product, loading, error } = useSelector((state) => state.products);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  // FIX: Actual cart logic
  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product._id, quantity }));
  };

  // Guard Clauses
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <p className="text-[#6e6e73] text-sm">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length ? product.images : [{ url: "" }];
  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-12 px-6">
      <div
        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm p-8 md:p-12 
                       grid md:grid-cols-2 gap-12"
      >
        {/* ───── LEFT — Images ───── */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-[#f5f5f7] aspect-square mb-4">
            <img
              src={images[selectedImage]?.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all
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
          <h1 className="text-3xl font-semibold text-[#1d1d1f] mb-2">
            {product.name}
          </h1>

          <p className="text-2xl font-medium text-[#0071e3] mb-6">
            ₹{product.price?.toLocaleString()}
          </p>

          <p className="text-sm text-[#6e6e73] leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="mb-6">
            {inStock ?
              <span className="text-sm text-green-600 font-medium">
                ✅ In Stock ({product.stock} available)
              </span>
            : <span className="text-sm text-red-500 font-medium">
                ❌ Out of Stock
              </span>
            }
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-medium text-[#1d1d1f]">Quantity</span>
            <div className="flex items-center border border-gray-200 rounded-full">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-lg"
              >
                −
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                className="w-9 h-9 flex items-center justify-center text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* FIX: handleAddToCart call ho rahi hai ab */}
          <Button
            type="button"
            disabled={!inStock}
            className="w-full"
            onClick={handleAddToCart}
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
