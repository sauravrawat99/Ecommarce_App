import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import ProductCard from "./products/ProductCard";
import { ShieldCheck, Truck, RotateCcw, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ───── HERO — ink block, same weight as the navbar wordmark ───── */}
      <section className="bg-[#0E1116]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-24 md:py-32 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/50 uppercase tracking-[0.2em] mb-5">
            <span className="w-1.5 h-1.5 bg-[#FF5A1F]" />
            New season drop
          </span>
          <h1 className="italic font-black uppercase text-4xl sm:text-5xl md:text-7xl text-white tracking-tight leading-[0.95]">
            Shopping made <span className="text-[#FF5A1F]">simple</span>.
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/50 mt-5 sm:mt-6 max-w-xl mx-auto not-italic">
            Best price, fast delivery, aur wo sab kuch jo tumhe chahiye — ek hi
            jagah pe.
          </p>
          <Link
            to="/collections/featured-all"
            className="inline-flex items-center gap-2 mt-8 sm:mt-10 bg-[#FF5A1F] text-white px-7 sm:px-9 py-3.5 rounded-[3px] font-bold uppercase tracking-[0.1em] text-xs sm:text-sm hover:bg-white hover:text-[#0E1116] active:scale-95 transition-all duration-200"
          >
            Shop Now <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ───── TRUST BADGES ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: Truck,
              title: "Fast Delivery",
              desc: "Deshbhar mein jaldi pahunche",
            },
            {
              icon: ShieldCheck,
              title: "Secure Payment",
              desc: "100% surakshit transactions",
            },
            {
              icon: RotateCcw,
              title: "Easy Returns",
              desc: "Aasan return aur refund",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-[#14161A]/10 rounded-[3px] p-5 sm:p-6 flex items-center gap-4"
            >
              <div className="w-11 h-11 shrink-0 bg-[#FF5A1F]/10 rounded-[3px] flex items-center justify-center">
                <Icon className="text-[#FF5A1F]" size={22} strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#14161A] uppercase tracking-wide">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5B6472] mt-0.5">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── CATEGORIES ───── */}
      {categories?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12">
          <div className="flex items-center gap-2.5 mb-5 sm:mb-8">
            <span className="w-2 h-2 bg-[#FF5A1F] shrink-0" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#14161A] uppercase tracking-tight">
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="group bg-white border border-[#14161A]/10 rounded-[3px] p-5 sm:p-6 flex flex-col items-center justify-center text-center hover:border-[#FF5A1F] transition-colors duration-200"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[3px] bg-[#14161A] flex items-center justify-center mb-3 group-hover:bg-[#FF5A1F] transition-colors">
                  <span className="text-lg sm:text-xl font-black text-white">
                    {cat.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#14161A] uppercase tracking-wide">
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
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-[#FF5A1F] shrink-0" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#14161A] uppercase tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link
            to="/collections/featured-all"
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#14161A] uppercase tracking-wide hover:text-[#FF5A1F] transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ?
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#14161A]/10 rounded-[3px] overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-[#14161A]/5" />
                <div className="p-3 sm:p-5 space-y-2">
                  <div className="h-3 bg-[#14161A]/10 rounded w-3/4" />
                  <div className="h-3 bg-[#14161A]/10 rounded w-1/2" />
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

      {/* ───── NEWSLETTER / CTA — ink block, mirrors the hero ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-12 sm:pb-16">
        <div className="bg-[#0E1116] rounded-[3px] px-6 sm:px-10 py-10 sm:py-14 text-center relative overflow-hidden">
          <span className="absolute top-0 left-0 w-full h-[3px] bg-[#FF5A1F]" />

          <h2 className="italic font-black uppercase text-xl sm:text-2xl md:text-3xl text-white mb-2 sm:mb-3 tracking-tight">
            Naye offers sabse pehle paayein
          </h2>
          <p className="text-white/50 text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto not-italic">
            Subscribe kar aur exclusive deals, naye products, aur discounts
            seedha apne inbox mein paayein.
          </p>

          {subscribed ?
            <p className="text-[#FF5A1F] font-bold text-sm sm:text-base">
              Shukriya! Aap subscribe ho gaye hain.
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
                className="flex-1 px-4 py-3 rounded-[3px] text-sm outline-none border border-white/15 bg-white/5 text-white placeholder:text-white/35 focus:ring-2 focus:ring-[#FF5A1F] focus:border-[#FF5A1F]"
              />
              <button
                type="submit"
                className="bg-[#FF5A1F] text-white px-6 py-3 rounded-[3px] font-bold uppercase tracking-[0.1em] text-xs sm:text-sm hover:bg-white hover:text-[#0E1116] active:scale-95 transition-all duration-150"
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
