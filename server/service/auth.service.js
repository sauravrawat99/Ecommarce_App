const User = require("../models/model.User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

// check user
const checkUserExists = async (email) => {
  const user = await User.findOne({ email });
  if (user) throw new ApiError("User already exists", 409);
};

// hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// create user
const createUser = async (name, email, password) => {
  return User.create({ name, email, password });
};

// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// login helpers
const findUser = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError("Invalid email", 400);
  return user;
};

const comparePassword = async (pass, hash) => {
  const match = await bcrypt.compare(pass, hash);
  if (!match) throw new ApiError("Invalid credentials", 401);
};

module.exports = {
  checkUserExists,
  hashPassword,
  createUser,
  generateToken,
  findUser,
  comparePassword,
};
