import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, User, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearch } from "../redux/slices/productSlice";
const Navbar = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false);
  };

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  const handleSubmite = (e) => {
    if (e.key === "Enter") {
      console.log(e.target.value);

      dispatch(fetchSearch(searchQuery));
    }
  };
  const navLinkClass = ({ isActive }) =>
    `text-lx tracking-wide transition-colors ${
      isActive ? "font-semibold text-black " : "text-gray-600 hover:text-black "
    }`;

  return (
    <nav className=" top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm h-20">
      {/* Top row */}
      <div className="flex items-center px-4 sm:px-8 py-4 text-lg  justify-center h-full">
        {/* Left third */}
        <div className="flex-1 flex items-center gap-4">
          {/* Hamburger — sirf mobile pe dikhega */}
          <button
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ?
              <X size={30} />
            : <Menu size={30} />}
          </button>

          {/* Search icon — sirf mobile pe */}
          <button
            className="md:hidden"
            onClick={toggleSearch}
            aria-label="Toggle search"
          >
            {isSearchOpen ?
              <X size={22} />
            : <Search size={22} />}
          </button>

          {/* Nav links — sirf desktop (md aur usse bada) pe dikhenge */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/collections/featured-all" className={navLinkClass}>
              Featured
            </NavLink>
            <NavLink to="/collections/men-all" className={navLinkClass}>
              Men
            </NavLink>
            <NavLink to="/collections/women-all" className={navLinkClass}>
              Women
            </NavLink>
          </div>
        </div>

        {/* Center third — logo */}
        <div className="flex-1 flex justify-center">
          <Link to="/" onClick={closeAll}>
            <h1 className="font-bold text-lg sm:text-xl tracking-wide">LOGO</h1>
          </Link>
        </div>

        {/* Right third */}
        <div className="flex-1 flex items-center justify-end gap-4">
          {/* Search box — sirf desktop pe inline dikhega */}
          <div className="hidden md:flex items-center border border-gray-200 rounded-full px-3 py-1.5 w-48 lg:w-64">
            <Search size={30} className="text-gray-400 mr-2 shrink-0" />
            <input
              onKeyDown={handleSubmite}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search"
              className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>
          <Link to={isLoggedIn ? "/wishList" : "/login"}>
            <Heart size={30} />
          </Link>
          <Link to={isLoggedIn ? "/profile" : "/login"}>
            <User size={30} />
          </Link>
          <Link to={isLoggedIn ? "/cart" : "/login"}>
            <ShoppingBag size={30} />
          </Link>
        </div>
      </div>

      {/* Mobile search dropdown — sirf mobile pe toggle hoga */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center border border-gray-200 rounded-full px-3 py-2">
            <Search size={16} className="text-gray-400 mr-2 shrink-0" />
            <input
              onKeyDown={handleSubmite}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search products"
              className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile menu dropdown — sirf mobile pe toggle hoga */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-4 text-base border-t border-gray-100 pt-3">
          <NavLink
            to="/collections/featured-all"
            onClick={closeAll}
            className={navLinkClass}
          >
            Featured
          </NavLink>
          <NavLink
            to="/collections/men-all"
            onClick={closeAll}
            className={navLinkClass}
          >
            Men
          </NavLink>
          <NavLink
            to="/collections/women-all"
            onClick={closeAll}
            className={navLinkClass}
          >
            Women
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
