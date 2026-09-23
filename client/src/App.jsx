import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/ui/Footer";

// Route Guards
import AdminRoute from "./components/AdminRoute";
import PrivateRoute from "./components/PrivateRoutes";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";

// Public Pages
import Home from "./pages/Home";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import Collections from "./pages/collections/collections";
import Slug from "./pages/collections/Slug";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProfilePage from "./pages/auth/ProfilePage";

// User Pages (login required)
import CartPage from "./pages/CartPage";
import Address from "./pages/Address"; // 🆕 shipping address / checkout page
import WishlistPage from "./pages/WishlistPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductList from "./pages/admin/AdminProductList";
import CreateProduct from "./pages/products/CreateProduct";
import EditProduct from "./pages/products/EditProduct"; // 🆕 tu jab bana le tab use kar
import CreateCollection from "./pages/collections/createCollection";
import UpdateCollection from "./pages/collections/UpdateCollection";
import CollectionsList from "./pages/collections/CollectionsList";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist } from "./redux/slices/wishlistSlice";
import { useEffect } from "react";

const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getWishlist());
    }
  }, [isLoggedIn, dispatch]);
  return (
    <>
      {" "}
      <div className="h-screen flex flex-col">
        <Navbar />

        {/* Root level pe ek hi baar — har route pe available rahega */}
        <Toaster position="top-center" />

        <main className="flex-1">
          {" "}
          <Routes>
            {/* ───── Public Routes — koi bhi dekh sakta hai ───── */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:slug" element={<Slug />} />

            {/* ───── Auth Routes — agar already logged in hai to redirect ───── */}
            <Route element={<RedirectIfAuthenticated />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* ───── Private Routes — login zaroori hai ───── */}

            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Address />} />
              <Route path="/wishlist" element={<WishlistPage />} />
            </Route>

            {/* ───── Admin Routes — sirf admin role access kar sakta hai ───── */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/products" element={<AdminProductList />} />
              <Route path="/admin/create-product" element={<CreateProduct />} />
              <Route path="/admin/edit-product/:id" element={<EditProduct />} />
              <Route path="/admin/collections" element={<CollectionsList />} />
              <Route
                path="/admin/collection/create"
                element={<CreateCollection />}
              />
              <Route
                path="/admin/collection/:id/edit"
                element={<UpdateCollection />}
              />
              <Route path="admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;
