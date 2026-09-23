// SlugCard.jsx
import { Link, useNavigate } from "react-router-dom";
import { IndianRupee, Heart, X, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const SlugCard = ({ props }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageIndex, setImageIndex] = useState(0);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { items, mutating } = useSelector((state) => state.wishList);
  const { loading: cartMutating } = useSelector((state) => state.cart); // ✅ fix — "mutating" nahi, "loading" hai cartSlice me

  const uniqueVariants = (props.variants || []).filter(
    (variant, index, self) =>
      index === self.findIndex((v) => v.color === variant.color),
  );

  const wishListIds = useMemo(
    () => new Set((items || []).map((item) => item._id)),
    [items],
  );

  const isWishlisted = wishListIds.has(props._id);

  const currentColor = uniqueVariants[imageIndex]?.color;
  const sizesForCurrentColor = (props.variants || []).filter(
    (v) => v.color === currentColor,
  );

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (mutating) return;

    if (isWishlisted) {
      dispatch(removeFromWishlist(props._id));
    } else {
      dispatch(addToWishlist(props._id));
    }
  };

  const handleImage = (index) => {
    setImageIndex(index);
    setSelectedSize(null);
  };

  const handleOpenQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setShowQuickAdd(true);
  };

  const handleConfirmAdd = () => {
    if (!selectedSize) return;
    if (cartMutating) return;

    dispatch(
      addToCart({
        productId: props._id,
        quantity: 1,
        size: selectedSize,
        color: currentColor,
      }),
    );

    setShowQuickAdd(false);
    setSelectedSize(null);
  };

  return (
    <div className="relative group flex flex-col h-full">
      {/* Image */}
      <div className="relative overflow-hidden rounded-xl aspect-[4/5] bg-gray-100">
        <Link to={`/product/${props.slug}`}>
          <img
            src={props.images[imageIndex]?.url || props.images[0]?.url}
            alt={props.name}
            className="h-full w-full object-cover"
          />
        </Link>

        <button
          onClick={handleWishlistToggle}
          disabled={mutating}
          className="absolute top-2.5 right-2.5 z-10 bg-white/90 rounded-full p-1.5 sm:p-2 hover:bg-white transition-colors disabled:opacity-60"
        >
          <Heart
            size={16}
            className={isWishlisted ? "text-red-500" : "text-black"}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* Dot indicators */}
        {props.images?.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
            {props.images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === imageIndex ? "bg-black" : "bg-black/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-0.5 mt-2.5 sm:mt-3 flex-1">
        {props.category?.name && (
          <p className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-500">
            {props.category.name}
          </p>
        )}
        <p className="text-sm sm:text-base line-clamp-1 font-medium">
          {props.name}
        </p>
        <p className="flex items-center text-sm sm:text-base font-medium">
          <IndianRupee size={13} />
          {props.price}
        </p>
      </div>

      {/* Swatches + quick-add icon */}
      <div className="flex items-center gap-2 justify-between mt-2.5">
        <div className="flex gap-1.5 flex-wrap">
          {uniqueVariants.slice(0, 4).map((variant, index) => (
            <button
              onClick={() => handleImage(index)}
              key={variant._id}
              title={variant.color}
              style={{ backgroundColor: variant.color || "#ccc" }}
              className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full border transition-all ${
                imageIndex === index ?
                  "border-black border-2"
                : "border-gray-300"
              }`}
            ></button>
          ))}
          {uniqueVariants.length > 4 && (
            <span className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-500">
              +{uniqueVariants.length - 4}
            </span>
          )}
        </div>

        <button
          onClick={handleOpenQuickAdd}
          className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 transition-colors shrink-0"
        >
          <ShoppingBag size={14} />
        </button>
      </div>

      {/* Quick-Add Modal */}
      {showQuickAdd && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
          onClick={() => setShowQuickAdd(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-square sm:aspect-auto sm:h-full bg-gray-100 rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none overflow-hidden">
              <img
                src={props.images[imageIndex]?.url}
                alt={props.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 sm:p-6 flex flex-col gap-4 relative">
              <button
                onClick={() => setShowQuickAdd(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black"
              >
                <X size={22} />
              </button>

              <Link
                to={`/product/${props.slug}`}
                className="text-sm underline text-gray-500 hover:text-black w-fit"
              >
                See full product details
              </Link>

              <h2 className="text-xl sm:text-2xl font-semibold">
                {props.name}
              </h2>

              <p className="flex items-center text-lg font-medium">
                <IndianRupee size={16} />
                {props.price}
              </p>

              <div>
                <p className="text-sm font-medium mb-2">
                  Color: <span className="capitalize">{currentColor}</span>
                </p>
                <div className="flex gap-2">
                  {uniqueVariants.map((variant, index) => (
                    <button
                      key={variant._id}
                      onClick={() => handleImage(index)}
                      style={{ backgroundColor: variant.color || "#ccc" }}
                      className={`h-9 w-9 rounded-full border transition-all ${
                        imageIndex === index ?
                          "border-black border-2"
                        : "border-gray-300"
                      }`}
                    ></button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Size:</p>
                <div className="grid grid-cols-4 gap-2">
                  {sizesForCurrentColor.map((variant) => {
                    const outOfStock = variant.stock === 0;
                    return (
                      <button
                        key={variant._id}
                        disabled={outOfStock}
                        onClick={() => setSelectedSize(variant.size)}
                        className={`h-11 rounded-lg border text-sm font-medium transition-all ${
                          outOfStock ?
                            "border-gray-200 text-gray-300 line-through cursor-not-allowed"
                          : selectedSize === variant.size ?
                            "bg-black text-white border-black"
                          : "border-gray-300 hover:border-black"
                        }`}
                      >
                        {variant.size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleConfirmAdd}
                disabled={!selectedSize || cartMutating}
                className="mt-2 h-12 rounded-full bg-black text-white font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {cartMutating ?
                  "Adding..."
                : selectedSize ?
                  "Add to Bag"
                : "Select a size"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlugCard;
