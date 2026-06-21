import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import axios from "axios"; // ya tera authService

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-sm p-10 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-8">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
          />
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>
        {message && (
          <p className="text-green-500 text-center mt-4">{message}</p>
        )}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
