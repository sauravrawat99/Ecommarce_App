const AsyncHandler = require("../utils/AsyncError");
const ApiError = require("../utils/ApiError");
const {
  validateRegister,
  validateLogin,
  validateResetPassword,
} = require("../validator/auth.validator");
const {
  checkUserExists,
  hashPassword,
  createUser,
  generateToken,
  findUser,
  comparePassword,
  findbyId,
  forgotPasswordService,
  resetPasswordservice,
} = require("../service/auth.service");
const setTokenCookie = require("../utils/Cookie");

// 1. Register
exports.register = AsyncHandler(async (req, res) => {
  validateRegister(req.body); // validate

  const { name, email, password } = req.body;
  await checkUserExists(email); // user exists?
  const hashed = await hashPassword(password); // hash
  const user = await createUser(
    // create
    name,
    email.toLowerCase(),
    hashed,
  );
  const token = generateToken(user._id); // token
  setTokenCookie(res, token); // cookie

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// 2. Login
exports.login = AsyncHandler(async (req, res) => {
  validateLogin(req.body); // validate

  const { email, password } = req.body;
  const user = await findUser(email); // find
  await comparePassword(user, password); // compare
  const token = generateToken(user._id); // token
  setTokenCookie(res, token); // cookie

  res.json({
    success: true,
    message: "Login successful",
    token,
  });
});

// 3. Logout
exports.logout = AsyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});

// 4. Get Profile
exports.getProfile = AsyncHandler(async (req, res) => {
  const user = await findbyId(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// 5. Forgot Password
exports.forgotPassword = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  await forgotPasswordService(email);
  res.status(200).json({
    success: true,
    message: `Reset link ${email} pe bhej diya!`,
  });
});

// 6. Reset Password
exports.resetPassword = AsyncHandler(async (req, res) => {
  validateResetPassword(req.body);
  const { token, newPassword } = req.body;
  await resetPasswordservice(token, newPassword);
  res.status(200).json({
    success: true,
    message: "Password reset successfully!",
  });
});
