import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import ProductCard from "./products/ProductCard";
import { ShieldCheck, Truck, RotateCcw, Mail } from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.category);

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const featuredProducts = products?.slice(0, 4) || [];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: yahan actual newsletter API call laga dena jab backend ready ho
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* ───── HERO ───── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-14 sm:py-20 md:py-28 text-center">
          <h1
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Shopping made <span className="text-indigo-600">simple</span>.
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 mt-4 sm:mt-6 max-w-xl mx-auto">
            Best price, fast delivery, aur wo sab kuch jo tumhe chahiye — ek hi
            jagah pe.
          </p>
          <Link
            to="/products"
            className="inline-block mt-6 sm:mt-8 bg-indigo-600 text-white px-6 sm:px-8 py-3 rounded-full font-medium text-sm sm:text-base hover:bg-indigo-700 active:scale-95 transition-all duration-200"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* ───── TRUST BADGES ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 flex items-center gap-4">
            <Truck className="text-indigo-600 shrink-0" size={28} />
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                Fast Delivery
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Deshbhar mein jaldi pahunche
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 flex items-center gap-4">
            <ShieldCheck className="text-indigo-600 shrink-0" size={28} />
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                Secure Payment
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                100% surakshit transactions
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 flex items-center gap-4">
            <RotateCcw className="text-indigo-600 shrink-0" size={28} />
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                Easy Returns
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Aasan return aur refund
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── CATEGORIES ───── */}
      {categories?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight mb-5 sm:mb-8">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="group bg-white rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-indigo-50 flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors">
                  <span className="text-lg sm:text-xl font-semibold text-indigo-600">
                    {cat.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-800">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ───── FEATURED PRODUCTS ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-5 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View all →
          </Link>
        </div>

        {loading ?
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 sm:p-5 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        : <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        }
      </section>

      {/* ───── NEWSLETTER / CTA ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-12 sm:pb-16">
        <div className="bg-indigo-600 rounded-2xl sm:rounded-3xl px-6 sm:px-10 py-10 sm:py-14 text-center">
          <Mail className="text-white mx-auto mb-4" size={28} />
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Naye offers sabse pehle paayein
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">
            Subscribe kar aur exclusive deals, naye products, aur discounts
            seedha apne inbox mein paayein.
          </p>

          {subscribed ?
            <p className="text-white font-medium text-sm sm:text-base">
              🎉 Shukriya! Aap subscribe ho gaye hain.
            </p>
          : <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Apna email daalein"
                className="flex-1 px-4 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="bg-white text-indigo-600 px-6 py-3 rounded-full font-medium text-sm hover:bg-gray-100 active:scale-95 transition-all duration-150"
              >
                Subscribe
              </button>
            </form>
          }
        </div>
      </section>
    </div>
  );
};

export default Home;
