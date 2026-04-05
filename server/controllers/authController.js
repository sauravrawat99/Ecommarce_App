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

  await checkUserExists(email);

  const hashed = await hashPassword(password);

  const user = await createUser(name, email, hashed);

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
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

  await comparePassword(password, user.password);

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});
