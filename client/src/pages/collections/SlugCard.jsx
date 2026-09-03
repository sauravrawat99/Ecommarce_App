import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, IndianRupee, Heart } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";

const SlugCard = ({ props }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageIndex, setImageIndex] = useState(0);

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { items, mutating } = useSelector((state) => state.wishList);

  const uniqueVariants = props.variants.filter(
    (variant, index, self) =>
      index === self.findIndex((v) => v.color === variant.color),
  );

  const wishListIds = useMemo(
    () => new Set((items || []).map((item) => item._id)),
    [items],
  );

  const isWishlisted = wishListIds.has(props._id);

  const handleWishlistToggle = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (mutating) return; // rapid double-click block

    if (isWishlisted) {
      dispatch(removeFromWishlist(props._id));
    } else {
      dispatch(addToWishlist(props._id));
    }
  };

  const handleImage = (index) => {
    setImageIndex(index);
  };

  return (
    <div className="group flex flex-col h-full bg-gray-100 rounded-2xl p-4 text-xl">
      <div className="relative overflow-hidden rounded-xl aspect-[3/4] bg-gray-200">
        <Link to={`/products/${props.slug}`}>
          <img
            src={props.images[imageIndex]?.url || props.images[0]?.url}
            alt={props.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <button
          onClick={handleWishlistToggle}
          disabled={mutating}
          className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors disabled:opacity-60"
        >
          <Heart
            size={20}
            className={isWishlisted ? "text-red-500" : "text-black"}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="flex flex-col gap-1 mt-3.5 flex-1">
        <p className="line-clamp-1 font-medium">{props.name}</p>
        <p className="flex items-center gap-1 text-lg">
          <IndianRupee size={16} />
          {props.price}
        </p>
      </div>

      <div className="flex items-center gap-3 justify-between mt-3">
        <div className="flex gap-2">
          {uniqueVariants.map((variant, index) => (
            <button
              onClick={() => handleImage(index)}
              key={variant._id}
              title={variant.color}
              style={{ backgroundColor: variant.color || "#ccc" }}
              className={`h-8 w-8 rounded-full border transition-all ${
                imageIndex === index ?
                  "border-black border-2"
                : "border-gray-300"
              }`}
            ></button>
          ))}
        </div>

        <button
          className="
            flex items-center justify-center gap-2
            h-10 px-3
            text-black bg-gray-200
            rounded-full
            overflow-hidden whitespace-nowrap
            transition-all duration-300 ease-out
          "
        >
          <ShoppingBag size={18} className="shrink-0" />
          <span
            className="
              max-w-0 opacity-0
              group-hover:max-w-[120px] group-hover:opacity-100
              transition-all duration-300 ease-out
              text-base font-medium
            "
          >
            Add to Cart
          </span>
        </button>
      </div>
    </div>
  );
};

export default SlugCard;
