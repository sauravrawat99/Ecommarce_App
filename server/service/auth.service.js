const User = require("../models/model.User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const crypto = require("crypto");
const sendEmail = require("../utils/EmailSend");

// check user
exports.checkUserExists = async (email) => {
  const user = await User.findOne({ email });
  if (user) throw new ApiError("User already exists", 409);
};

// hash password
exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// create user
exports.createUser = async (name, email, password) => {
  return User.create({ name, email, password });
};

// generate token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// login helpers
exports.findUser = async (email) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError("Invalid email", 400);
  return user;
};

exports.comparePassword = async (user, password) => {
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
exports.findbyId = async (_id) => {
  const user = await User.findById({ _id });
  if (!user) throw new ApiError("Invalid email", 400);
  return user;
};

exports.forgotPasswordService = async (email) => {
  // Step 1 — User dhundo
  const user = await User.findOne({ email });
  if (!user) throw new ApiError("User not found", 404);

  //  Token save
  const token = crypto.randomBytes(32).toString("hex");

  // DB mein save karo
  user.resetPasswordToken = token;
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
  await user.save();

  // Step 4 — Link banao
  const resetLink = `http://localhost:5173/reset-password/${token}`;

  // Step 5 — Email bhejo
  await sendEmail({
    to: user.email,
    subject: "Password Reset Link",
    html: `
      <h2>Password Reset</h2>
      <p>Neeche link pe click karo:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p> token expire in 1 hours</p>
    `,
  });
};

exports.resetPasswordservice = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) throw new ApiError("User not found", 404);
  user.password = newPassword;

  // clear resettoken
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;

  await user.save();
};
