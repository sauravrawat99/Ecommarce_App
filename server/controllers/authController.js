const asyncHandler = require("../utils/AsyncError");
const {
  validateRegister,
  validateLogin,
} = require("../validator/auth.validator");

const {
  checkUserExists,
  hashPassword,
  createUser,
  generateToken,
  findUser,
  comparePassword,
  findbyId,
} = require("../service/auth.service");
const setTokenCookie = require("../utils/Cookie");

// register
exports.register = asyncHandler(async (req, res) => {
  validateRegister(req.body);

  const { name, email, password } = req.body;

  // 1. check user
  await checkUserExists(email);

  // 2. hash password
  const hashed = await hashPassword(password);

  // 3. create user
  const user = await createUser(name, email.toLowerCase(), hashed);

  // 4. generate token
  const token = generateToken(user._id);

  // 5. set cookie
  setTokenCookie(res, token);
  // 6. send response
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// login
exports.login = asyncHandler(async (req, res) => {
  validateLogin(req.body);

  const { email, password } = req.body;

  const user = await findUser(email);

  await comparePassword(user, password);

  const token = generateToken(user._id);

  setTokenCookie(res, token);
  res.json({
    success: true,
    message: "Login success ",
    token,
  });
});

exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    massage: "Logout successfully",
    token: null,
  });
};

exports.getProfile = async (req, res) => {
  const user = await findbyId(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
};
