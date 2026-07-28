import Input from "../../components/ui/Input";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/ui/Button";
import { registerUser } from "../../redux/slices/authSlice";
import AuthLayout from "../../components/AuthLayout";
import { Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

const Register = () => {
  const dispatch = useDispatch();
  const { error, loading, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <AuthLayout
      title="Join ShopKart today"
      subtitle="Account banao aur exclusive deals, fast checkout, aur order tracking ka fayda uthao."
    >
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">
        Create Account
      </h1>
      <p className="text-sm text-gray-500 mb-6 sm:mb-8">
        Kuch seconds mein apna account bana lein
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          name="name"
          icon={User}
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
        />
        <Input
          label="Email"
          type="email"
          name="email"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      {user && (
        <p className="text-center text-sm text-green-600 mt-5">
          Registered successfully!
        </p>
      )}
      {error && (
        <p className="text-center text-sm mt-5 text-red-500">{error}</p>
      )}

      <p className="text-center text-sm text-gray-500 mt-8">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-600 font-medium hover:text-indigo-700"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
