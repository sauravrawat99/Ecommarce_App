const express = require("express");
const {
  register,
  login,
  logout,
  getProfile,
} = require("../controllers/authController");
const rateLimit = require("express-rate-limit");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: "Too many login attempts, please try again later",
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getProfile);

module.exports = router;
