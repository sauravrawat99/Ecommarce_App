// src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "../../components/AuthLayout.jsx";
import Spinner from "../../components/ui/Spinner";
import { loginUser } from "../../redux/slices/authSlice"; // ✅ thunk import, authService nahi

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ "loading" field use karo, "status" nahi
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ✅ authService.login nahi — loginUser thunk dispatch karo
    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue your shopping journey with ShopKart."
    >
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-[#14161A]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Sign in
        </h1>
        <p className="text-sm text-[#5B6472] mt-1">
          Enter your details to access your account.
        </p>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-[3px] bg-[#E5484D]/10 text-[#E5484D] text-sm border border-[#E5484D]/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#14161A] mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className="w-full px-3 py-2.5 rounded-[3px] border border-[#14161A]/20 text-[#14161A] placeholder-[#5B6472]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:border-transparent"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-[#14161A]">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-[#FF5A1F] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full px-3 py-2.5 rounded-[3px] border border-[#14161A]/20 text-[#14161A] placeholder-[#5B6472]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[3px] bg-[#FF5A1F] text-white font-semibold py-2.5 mt-2 flex items-center justify-center gap-2 hover:bg-[#FF5A1F]/90 transition disabled:opacity-70"
        >
          {loading ?
            <Spinner size="sm" color="white" />
          : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-[#5B6472] text-center mt-6">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-[#FF5A1F] font-medium hover:underline"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
