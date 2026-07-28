import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthLayout from "../../components/AuthLayout";
import { Lock, ArrowLeft } from "lucide-react";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/auth/reset-password", { token, newPassword });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Naya password set karein"
      subtitle="Ek strong password chunein jo aapne pehle use na kiya ho."
    >
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to login
      </Link>

      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">
        Reset Password
      </h1>
      <p className="text-sm text-gray-500 mb-6 sm:mb-8">
        Apna naya password neeche daalein
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          label="New Password"
          icon={Lock}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      {error && (
        <p className="text-red-500 text-center text-sm mt-5">{error}</p>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
