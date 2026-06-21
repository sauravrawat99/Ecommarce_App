import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-gray-800">
        ShopKart
      </Link>

      {/* Links */}
      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <Link to="/products" className="text-gray-600 hover:text-gray-900">
          Products
        </Link>

        {isLoggedIn ?
          <>
            <Link to="/cart" className="text-gray-600 hover:text-gray-900">
              Cart
            </Link>
            <Link to="/wishlist" className="text-gray-600 hover:text-gray-900">
              Wishlist
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-gray-900">
              {user?.name || "Profile"}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </>
        : <>
            <Link to="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Register
            </Link>
          </>
        }
      </div>
    </nav>
  );
};

export default Navbar;
