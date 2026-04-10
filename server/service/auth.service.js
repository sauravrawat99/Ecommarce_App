const User = require("../models/model.User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const { json } = require("express");

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
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError("Invalid email", 400);
  return user;
};

const comparePassword = async (user, password) => {
  // check account locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    throw new ApiError("Account locked. Try again later", 403);
  }

  const match = await bcrypt.compare(password, user.password);

  // ❌ wrong password
  if (!match) {
    user.loginAttempts += 1;

    if (user.loginAttempts >= 3) {
      user.lockUntil = Date.now() + 10 * 60 * 1000;
    }

    await user.save();

    throw new ApiError("Invalid credentials", 401);
  }

  // ✅ correct password → reset
  user.loginAttempts = 0;
  user.lockUntil = undefined;

  await user.save();

  return true;
};

module.exports = {
  checkUserExists,
  hashPassword,
  createUser,
  generateToken,
  findUser,
  comparePassword,
};
