const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.model");

exports.isAuthenticated = async (req, res, next) => {
  try {
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

    const user = await User.findById(decoded.id);
    if (!user) throw new ApiError("User not found", 401);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
