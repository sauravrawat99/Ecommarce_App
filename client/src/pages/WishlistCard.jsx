import { Link } from "react-router-dom";
import { IndianRupee, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../redux/slices/wishlistSlice";

const WishlistCard = ({ product }) => {
  const dispatch = useDispatch();
  const { mutating } = useSelector((state) => state.wishList);

  const handleRemove = (e) => {
    e.preventDefault();
    if (mutating) return;
    dispatch(removeFromWishlist(product._id));
  };

  return (
    <div className="relative group">
      <Link to={`/product/${product.slug}`}>
        <div className="relative overflow-hidden rounded-xl aspect-square bg-gray-100">
          <img
            src={product.images?.[0]?.url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      <button
        onClick={handleRemove}
        disabled={mutating}
        className="absolute top-2.5 right-2.5 z-10 bg-white/90 rounded-full p-1.5 hover:bg-white transition-colors disabled:opacity-60"
      >
        <X size={16} />
      </button>

      <div className="flex flex-col gap-0.5 mt-2.5">
        <p className="text-sm sm:text-base line-clamp-1 font-medium">
          {product.name}
        </p>
        <p className="flex items-center text-sm sm:text-base font-medium">
          <IndianRupee size={13} />
          {product.price}
        </p>
      </div>
    </div>
  );
};

export default WishlistCard;
