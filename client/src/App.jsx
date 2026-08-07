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
import ProductList from "./pages/products/ProductList";
import ProductDetailPage from "./pages/products/ProductDetailPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProfilePage from "./pages/auth/ProfilePage";

// User Pages (login required)
import CartPage from "./pages/CartPage";
import Address from "./pages/Address"; // 🆕 shipping address / checkout page

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductList from "./pages/admin/AdminProductList";
import CreateProduct from "./pages/products/CreateProduct";
import EditProduct from "./pages/products/EditProduct"; // 🆕 tu jab bana le tab use kar

const App = () => {
  return (
    <>
      {/* Root level pe ek hi baar — har route pe available rahega */}
      <Toaster position="top-center" />

      <Navbar />

      <Routes>
        {/* ───── Public Routes — koi bhi dekh sakta hai ───── */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ───── Auth Routes — agar already logged in hai to redirect ───── */}
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* ───── Private Routes — login zaroori hai ───── */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Address />
            </PrivateRoute>
          }
        />

        {/* ───── Admin Routes — sirf admin role access kar sakta hai ───── */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProductList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/create-product"
          element={
            <AdminRoute>
              <CreateProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
