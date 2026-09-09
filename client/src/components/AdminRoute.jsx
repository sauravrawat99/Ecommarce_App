// src/components/AdminRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // 🆕 ye naya check hai
  if (user?.role !== "admin") {
    return <Navigate to="/" />; // ya koi "Access Denied" page bana sakta hai
  }

  return <Outlet />;
};

export default AdminRoute;
