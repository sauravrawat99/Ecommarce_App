const express = require("express");
const { register, login } = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: "Too many login attempts, please try again later",
});

router.post("/register", register);
router.post("/login", loginLimiter, login);

module.exports = router;
