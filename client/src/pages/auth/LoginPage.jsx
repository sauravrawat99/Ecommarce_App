import { useState } from "react";
import Input from "../../components/ui/Input";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import Button from "../../components/ui/Button";
import AuthLayout from "../../components/AuthLayout";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import Spinner from "../../components/ui/Spinner";

const LoginPage = () => {
  const dispatch = useDispatch();
  const { error, loading, user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <AuthLayout
      title="Welcome back to ShopKart"
      subtitle="Login karke apne orders track karein, wishlist dekhein, aur shopping continue karein jahan chhodi thi."
    >
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">
        Login
      </h1>
      <p className="text-sm text-gray-500 mb-6 sm:mb-8">
        Apna account access karne ke liye details daalein
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email"
          name="email"
          icon={Mail}
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        <Input
          type="password"
          label="Password"
          name="password"
          icon={Lock}
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ?
            <Spinner />
          : "Login"}
        </Button>
      </form>

      {user && (
        <p className="text-center text-sm text-green-600 mt-5">
          Login successful, {user.name}!
        </p>
      )}
      {error && (
        <p className="text-center text-sm mt-5 text-red-500">{error}</p>
      )}

      <p className="text-center text-sm text-gray-500 mt-8">
        Naya account?{" "}
        <Link
          to="/register"
          className="text-indigo-600 font-medium hover:text-indigo-700"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
