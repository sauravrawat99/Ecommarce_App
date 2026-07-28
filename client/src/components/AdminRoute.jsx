// src/components/AdminRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // 🆕 ye naya check hai
  if (user?.role !== "admin") {
    return <Navigate to="/" />; // ya koi "Access Denied" page bana sakta hai
  }

  return children;
};

export default AdminRoute;
