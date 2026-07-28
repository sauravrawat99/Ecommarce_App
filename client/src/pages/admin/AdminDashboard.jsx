import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../../redux/slices/adminSlice";
import {
  Package,
  Users,
  ShoppingBag,
  IndianRupee,
  Clock,
  Plus,
  FolderTree,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  const statCards = [
    {
      label: "Total Products",
      value: stats?.totalProducts ?? 0,
      icon: Package,
      gradient: "from-indigo-500 to-indigo-600",
      glow: "shadow-indigo-200",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      gradient: "from-sky-500 to-sky-600",
      glow: "shadow-sky-200",
    },
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      gradient: "from-emerald-500 to-emerald-600",
      glow: "shadow-emerald-200",
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      icon: Clock,
      gradient: "from-amber-500 to-amber-600",
      glow: "shadow-amber-200",
    },
    {
      label: "Total Revenue",
      value: `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: IndianRupee,
      gradient: "from-rose-500 to-rose-600",
      glow: "shadow-rose-200",
    },
  ];

  const quickLinks = [
    {
      title: "Manage Products",
      description: "View, edit, ya delete existing products",
      to: "/admin/products",
      icon: Package,
      accent: "text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600",
    },
    {
      title: "Add New Product",
      description: "Naya product listing create karein",
      to: "/admin/create-product",
      icon: Plus,
      accent: "text-amber-600 bg-amber-50 group-hover:bg-amber-500",
    },
    {
      title: "Manage Categories",
      description: "Product categories add ya edit karein",
      to: "/admin/categories",
      icon: FolderTree,
      accent: "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-500",
    },
    {
      title: "Orders",
      description: "Customer orders dekhein aur status update karein",
      to: "/admin/orders",
      icon: ShoppingBag,
      accent: "text-sky-600 bg-sky-50 group-hover:bg-sky-500",
    },
  ];

  const statusStyles = {
    pending: "bg-amber-50 text-amber-600",
    processing: "bg-sky-50 text-sky-600",
    shipped: "bg-indigo-50 text-indigo-600",
    delivered: "bg-emerald-50 text-emerald-600",
    cancelled: "bg-red-50 text-red-500",
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* ───── Gradient Header Banner ───── */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-14 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-amber-300" />
            <span className="text-indigo-200 text-xs sm:text-sm font-medium uppercase tracking-wide">
              Admin Panel
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base mt-2">
            Aaj ShopKart mein kya ho raha hai, ek nazar mein dekhein.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 -mt-6 sm:-mt-8 pb-12 sm:pb-16 relative z-10">
        {/* Loading / Error */}
        {loading && !stats && (
          <div className="bg-white rounded-2xl p-8 text-center text-sm text-gray-500 shadow-lg mb-8">
            Loading dashboard...
          </div>
        )}
        {error && (
          <div className="bg-white rounded-2xl p-8 text-center text-sm text-red-500 shadow-lg mb-8">
            {error}
          </div>
        )}

        {/* ───── Stat Cards ───── */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5 mb-8 sm:mb-12">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className={`bg-white rounded-2xl p-4 sm:p-6 shadow-lg ${stat.glow} hover:-translate-y-1 transition-transform duration-200`}
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 sm:mb-4 shadow-md`}
                >
                  <stat.icon size={20} className="text-white" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ───── Recent Orders ───── */}
        {stats?.recentOrders?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-8 sm:mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Recent Orders
              </h2>
              <Link
                to="/admin/orders"
                className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between gap-3 py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {order.user?.name || "Unknown user"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {order.user?.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{order.totalPrice?.toLocaleString()}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        statusStyles[order.orderStatus] ||
                        "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───── Quick Links ───── */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              to={link.to}
              className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${link.accent} group-hover:text-white`}
                >
                  <link.icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                    {link.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {link.description}
                  </p>
                </div>
              </div>
              <ArrowRight
                size={18}
                className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300 shrink-0"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
