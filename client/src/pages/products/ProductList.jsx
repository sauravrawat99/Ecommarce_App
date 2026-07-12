import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-6 md:px-12 py-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-semibold text-[#1d1d1f] tracking-tight">
          Shop
        </h1>
        <p className="text-sm text-[#6e6e73] mt-2">
          {!loading && !error && `${products.length} products available`}
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Loading — Skeleton Cards (Apple jaisa shimmer effect) */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="p-5 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#6e6e73] text-sm">No products found.</p>
          </div>
        )}

        {/* Grid — Products */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
