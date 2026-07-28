import { Routes, Route } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import ForgotPassword from "./pages/auth/ForgotPassword";
import LoginPage from "./pages/auth/LoginPage";
import ProfilePage from "./pages/auth/ProfilePage";
import RegisterPage from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import PrivateRoute from "./components/PrivateRoutes";
import CreateProduct from "./pages/products/CreateProduct";
import ProductList from "./pages/products/ProductList";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import Footer from "./components/ui/Footer";
import Home from "./pages/Home";
import AdminProductList from "./pages/admin/AdminProductList";
import EditProduct from "./pages/products/EditProduct"; // 🆕 tu jab bana le tab uncomment/use kar
import AdminDashboard from "./pages/admin/AdminDashboard";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
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

        {/* 🆕 Admin — Product List */}
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProductList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* 🆕 Admin — Edit Product (:id dynamic param hai) */}
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
