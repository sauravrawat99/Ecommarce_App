import Input from "../../components/ui/Input";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/ui/Button";
import { registerUser } from "../../redux/slices/authSlice";

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
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-sm p-10 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-8">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <Button type="submit" className="w-full bg-blue-300">
            Submit
          </Button>
        </form>

        {user && <p className="text-center mt-4">Register successfully...</p>}
        {loading && <p className="text-center mt-4">Registering...</p>}
        {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default Register;
