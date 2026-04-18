const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const AsyncError = require("../utils/AsyncError");

module.exports = AsyncError((req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Check 1 — Header hai?
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError("No token", 401);
  }

  // ✅ Fix — "Bearer eyJ..." → split karo → sirf "eyJ..." lo
  const token = authHeader.split(" ")[1];

  // ✅ Check 2 — Token empty toh nahi?
  if (!token) throw new ApiError("No token", 401);

  // ✅ Ab verify karega sahi se!
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded;
  next();
});
