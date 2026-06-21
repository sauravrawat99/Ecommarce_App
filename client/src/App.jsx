import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // ✅ Import karo
import ForgotPassword from "./pages/auth/ForgotPassword";
import LoginPage from "./pages/auth/LoginPage";
import ProfilePage from "./pages/auth/ProfilePage";
import RegisterPage from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import PrivateRoute from "./components/PrivateRoutes";

const App = () => {
  return (
    <>
      <Navbar /> {/* ✅ Yahan lagao — Routes ke bahar */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
