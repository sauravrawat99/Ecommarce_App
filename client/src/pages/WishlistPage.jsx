// src/pages/WishlistPage.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { getWishlist } from "../redux/slices/wishlistSlice";
import WishlistCard from "./WishlistCard";
import Spinner from "../components/ui/Spinner";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.wishList);
//   const { items, loading, error } = useSelector((state) => state.wishList);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-[#14161A]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          My Wishlist
        </h1>
        <p className="text-sm text-[#5B6472] mt-1">
          Items you've saved for later.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <Spinner size="md" />
        </div>
      )}

      {error && !loading && (
        <div className="px-3 py-2 rounded-[3px] bg-[#E5484D]/10 text-[#E5484D] text-sm border border-[#E5484D]/20">
          {error}
        </div>
      )}

      {!loading && !error && items?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart size={48} className="text-[#5B6472]/40 mb-4" />
          <p className="text-[#14161A] font-medium">Your wishlist is empty</p>
          <p className="text-sm text-[#5B6472] mt-1">
            Save items you love, find them here anytime.
          </p>
        </div>
      )}

      {!loading && !error && items?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((product) => (
            <WishlistCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
