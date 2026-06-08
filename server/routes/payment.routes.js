const express = require("express");
const router = express.Router();
const {
  createPayment,
  verifyPayment,
} = require("../controllers/payment.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");

router.use(isAuthenticated);

router.post("/create", createPayment);
router.post("/verify", verifyPayment);

module.exports = router;
