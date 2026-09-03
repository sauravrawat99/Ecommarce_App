import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const imageUrl =
    product.images?.[0]?.url || "https://placehold.co/400x400?text=No+Image";

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div
        className="bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl 
                       transition-all duration-300 overflow-hidden"
      >
        {/* Image */}
        <div className="relative aspect-square bg-[#f5f5f7] overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover 
                       group-hover:scale-105 transition-transform duration-500"
          />

          {/* Stock Badge */}
          {/* {!inStock && (
            <span
              className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/80 text-white 
                              text-[10px] sm:text-xs px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full"
            >
              Out of Stock
            </span> */}
          {/* )} */}
        </div>

        {/* Details */}
        <div className="p-3 sm:p-5">
          <h3 className="text-xs sm:text-sm font-medium text-[#1d1d1f] truncate mb-1">
            {product.name}
          </h3>
          <p className="text-[11px] sm:text-xs text-[#6e6e73] truncate mb-2 sm:mb-3">
            {product.description}
          </p>

          <div className="flex items-center justify-between gap-2">
            <p className="text-base sm:text-lg font-semibold text-[#1d1d1f]">
              ₹{product.price?.toLocaleString()}
            </p>
            <span
              className="text-xs font-medium text-[#0071e3] 
                              opacity-100 sm:opacity-0 sm:group-hover:opacity-100 
                              transition-opacity duration-300 shrink-0"
            >
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
