const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const crypto = require("crypto");
const sendEmail = require("../utils/EmailSend");

// 1. User exists check
exports.checkUserExists = async (email) => {
  const user = await User.findOne({ email });
  if (user) throw new ApiError("User already exists", 409);
};

// 2. Hash password
exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// 3. Create user
exports.createUser = async (name, email, password) => {
  return User.create({ name, email, password });
};

// 4. Generate JWT token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// 5. Find user by email
exports.findUser = async (email) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError("Invalid email", 400);
  return user;
};

// 6. Compare password + lock logic
exports.comparePassword = async (user, password) => {
  if (user.lockUntil && user.lockUntil > Date.now())
    throw new ApiError("Account locked. Try again later", 403);

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= 3) user.lockUntil = Date.now() + 10 * 60 * 1000;
    await user.save();
    throw new ApiError("Invalid credentials", 401);
  }

  // Reset on success
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();
  return true;
};

// 7. Find user by ID
exports.findbyId = async (_id) => {
  const user = await User.findById(_id);
  if (!user) throw new ApiError("User not found", 404);
  return user;
};

// 8. Forgot password
exports.forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError("User not found", 404);

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  const resetLink = `http://localhost:5173/reset-password/${token}`;
  await sendEmail({
    to: user.email,
    subject: "Password Reset Link",
    html: `
      <h2>Password Reset</h2>
      <p>Neeche link pe click karo:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Token 1 hour mein expire hoga</p>
    `,
  });
};

// 9. Reset password
exports.resetPasswordservice = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new ApiError("Invalid or expired token", 404);

  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();
};
