import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthLayout from "../../components/AuthLayout";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Password bhool gaye?"
      subtitle="Koi baat nahi — apna registered email daalein, hum aapko reset link bhej denge."
    >
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to login
      </Link>

      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">
        Forgot Password
      </h1>
      <p className="text-sm text-gray-500 mb-6 sm:mb-8">
        Reset link seedha aapke email pe bhej denge
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your registered email"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      {message && (
        <p className="text-green-600 text-center text-sm mt-5">{message}</p>
      )}
      {error && (
        <p className="text-red-500 text-center text-sm mt-5">{error}</p>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
