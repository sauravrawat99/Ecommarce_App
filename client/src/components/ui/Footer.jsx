import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 text-center sm:text-left">
        {/* Brand */}
        <div className="flex flex-col items-center sm:items-start">
          <h2
            className="text-xl sm:text-2xl font-bold text-white mb-3"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Shop<span className="text-indigo-400">Kart</span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            Apni zaroorat ki har cheez, ek hi jagah — best price, fast delivery.
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-indigo-400 transition-colors"
            >
              <FaFacebook size={18} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-indigo-400 transition-colors"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-indigo-400 transition-colors"
            >
              <FaTwitter size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-indigo-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="hover:text-indigo-400 transition-colors"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="hover:text-indigo-400 transition-colors"
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                to="/wishlist"
                className="hover:text-indigo-400 transition-colors"
              >
                Wishlist
              </Link>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
            Policies
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/privacy-policy"
                className="hover:text-indigo-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="hover:text-indigo-400 transition-colors"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                to="/refund-policy"
                className="hover:text-indigo-400 transition-colors"
              >
                Refund Policy
              </Link>
            </li>
            <li>
              <Link
                to="/shipping-policy"
                className="hover:text-indigo-400 transition-colors"
              >
                Shipping Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
            Contact Us
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-center sm:justify-start gap-2">
              <Mail size={16} className="text-indigo-400 shrink-0" />
              <span className="break-all">support@shopkart.com</span>
            </li>
            <li className="flex items-center justify-center sm:justify-start gap-2">
              <Phone size={16} className="text-indigo-400 shrink-0" />
              +91 98765 43210
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 text-center">
          <p>© {year} ShopKart. All rights reserved.</p>
          <p>Built with ❤️ by Saurav Rawat</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
