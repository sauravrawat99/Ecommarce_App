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
} = require("../service/auth.service");

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
  res.cookie("token", token, {
    httpOnly: true,
    // when production that time use it
    // secure: process.env.NODE_ENV === "production",
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

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

  res.cookie("token", token, {
    httpOnly: true,
    // when production that time use it
    // secure: process.env.NODE_ENV === "production",
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    message: "Login success ",
  });
});
