const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const rateLimit = require("express-rate-limit");
const isAuthenticated = require("../middleware/auth.middleware");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: "Too many login attempts, please try again later",
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
