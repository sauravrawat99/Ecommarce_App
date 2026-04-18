const ApiError = require("../utils/ApiError");

// Register Validator
exports.validateRegister = ({ name, email, password }) => {
  if (!name || !email || !password)
    throw new ApiError("All fields required", 400);

  if (!email.includes("@")) throw new ApiError("Invalid email", 400);

  if (password.length < 6) throw new ApiError("Password too short", 400);
};

// Login Validator
exports.validateLogin = ({ email, password }) => {
  if (!email || !password) throw new ApiError("Email & password required", 400);
};

// Reset Password Validator
exports.validateResetPassword = ({ token, newPassword }) => {
  if (!token || !newPassword)
    throw new ApiError("Token and newPassword required", 401);
};
