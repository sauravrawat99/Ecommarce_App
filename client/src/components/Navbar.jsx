import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { ShoppingCart, Heart, Menu, X, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItems = useSelector((state) => state.cart?.items) || [];
  const wishlistItems = useSelector((state) => state.wishlist?.items) || [];

  const isAdmin = isLoggedIn && user?.role === "admin"; // 🆕

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const navLinkClasses =
    "text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200";

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Shop<span className="text-indigo-600">Kart</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7">
          <Link to="/" className={navLinkClasses}>
            Home
          </Link>
          <Link to="/products" className={navLinkClasses}>
            Products
          </Link>

          {/* 🆕 Admin-only Dashboard link */}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className={`${navLinkClasses} flex items-center gap-1.5`}
            >
              <LayoutDashboard size={17} />
              Dashboard
            </Link>
          )}

          {isLoggedIn ?
            <>
              <Link
                to="/cart"
                className={`${navLinkClasses} relative flex items-center`}
              >
                <ShoppingCart size={20} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              <Link
                to="/wishlist"
                className={`${navLinkClasses} relative flex items-center`}
              >
                <Heart size={20} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link to="/profile" className={navLinkClasses}>
                {user?.name || "Profile"}
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 active:scale-95 transition-all duration-150"
              >
                Logout
              </button>
            </>
          : <>
              <Link to="/login" className={navLinkClasses}>
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 active:scale-95 transition-all duration-150"
              >
                Register
              </Link>
            </>
          }
        </div>

        {/* Mobile: cart icon (visible even when menu closed) + hamburger */}
        <div className="flex md:hidden items-center gap-4">
          {isLoggedIn && (
            <Link
              to="/cart"
              className="relative text-gray-700"
              onClick={closeMenu}
            >
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
          )}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="text-gray-700"
          >
            {isMenuOpen ?
              <X size={26} />
            : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-2 flex flex-col gap-4 border-t border-gray-100 pt-4">
          <Link to="/" className={navLinkClasses} onClick={closeMenu}>
            Home
          </Link>
          <Link to="/products" className={navLinkClasses} onClick={closeMenu}>
            Products
          </Link>

          {/* 🆕 Admin-only Dashboard link — mobile */}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className={`${navLinkClasses} flex items-center gap-2`}
              onClick={closeMenu}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          )}

          {isLoggedIn ?
            <>
              <Link
                to="/wishlist"
                className={`${navLinkClasses} flex items-center gap-2`}
                onClick={closeMenu}
              >
                <Heart size={18} />
                Wishlist
                {wishlistItems.length > 0 && (
                  <span className="bg-amber-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link
                to="/profile"
                className={navLinkClasses}
                onClick={closeMenu}
              >
                {user?.name || "Profile"}
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 active:scale-95 transition-all duration-150 w-full"
              >
                Logout
              </button>
            </>
          : <>
              <Link to="/login" className={navLinkClasses} onClick={closeMenu}>
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 active:scale-95 transition-all duration-150 text-center"
                onClick={closeMenu}
              >
                Register
              </Link>
            </>
          }
        </div>
      )}
    </nav>
  );
};

export default Navbar;
