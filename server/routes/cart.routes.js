const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = require("../controllers/cart.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");

router.use(isAuthenticated);

router.get("/", getCart);
router.post("/add", addToCart);
router.delete("/remove/:productId", removeFromCart);
router.put("/update/:productId", updateQuantity);
router.delete("/clear", clearCart);

module.exports = router;
