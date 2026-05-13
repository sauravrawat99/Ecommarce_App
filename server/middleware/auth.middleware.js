const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const AsyncHandle = require("../utils/AsyncHandle");

exports.isAuthenticated = AsyncHandle((req, res, next) => {
  // Cookie se token
  const cookieToken = req.cookies?.token;

  // Header se token — Bearer hata ke
  const headerToken =
    req.headers.authorization?.startsWith("Bearer ") ?
      req.headers.authorization.split(" ")[1]
    : null;

  // Jo bhi mile
  const token = cookieToken || headerToken;

  // Koi nahi mila?
  if (!token) throw new ApiError("No token", 401);

  // Verify karo
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // User set karo
  req.user = decoded;
  next();
});
