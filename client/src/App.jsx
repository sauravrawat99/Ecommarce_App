import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // ✅ Import karo
import ForgotPassword from "./pages/auth/ForgotPassword";
import LoginPage from "./pages/auth/LoginPage";
import ProfilePage from "./pages/auth/ProfilePage";
import RegisterPage from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import PrivateRoute from "./components/PrivateRoutes";
import CreateProduct from "./pages/products/CreateProduct";
import ProductList from "./pages/products/ProductList";
import ProductDetailPage from "./pages/products/ProductDetailPage";

const App = () => {
  return (
    <>
      <Navbar /> {/* ✅ Yahan lagao — Routes ke bahar */}
      <Routes>
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
            <PrivateRoute>
              <CreateProduct />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
