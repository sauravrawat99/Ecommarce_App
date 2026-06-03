const express = require("express");
const router = express.Router();
const {
  newOrder,
  MyOrders,
  singleOrder,
  cancelOrder,
  updateOrderStatus,
} = require("../controllers/order.controller");

const { isAuthenticated } = require("../middleware/auth.middleware");

router.use(isAuthenticated);

router.post("/", newOrder);
router.get("/my-orders", MyOrders);
router.get("/:id", singleOrder);
router.put("/cancel/:id", cancelOrder);
router.put("/status/:id", updateOrderStatus);

module.exports = router;
