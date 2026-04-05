const ApiError = require("../utils/ApiError");

const validateRegister = ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new ApiError("All fields required", 400);
  }

  if (!email.includes("@")) {
    throw new ApiError("Invalid email", 400);
  }

  if (password.length < 6) {
    throw new ApiError("Password too short", 400);
  }
};

const validateLogin = ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError("Email & password required", 400);
  }
};

module.exports = { validateRegister, validateLogin };
