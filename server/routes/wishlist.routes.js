const express = require("express");
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishList.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");
router.use(isAuthenticated);

router.get("/", getWishlist);
router.post("/add", addToWishlist);
router.delete("/:productId", removeFromWishlist);

module.exports = router;
