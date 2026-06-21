import { useState } from "react";
import Input from "../../components/ui/Input";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-sm p-10 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-8">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <Input
            type="password"
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <Link
          to="/forgot-password"
          className="text-blue-500 text-sm block text-center mt-4"
        >
          Forgot Password?
        </Link>

        {user && (
          <p className="text-center text-green-400">
            {`Login successfully ${user.name}`}
          </p>
        )}
        {loading && <p className="text-center mt-4">Logging in...</p>}
        {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
