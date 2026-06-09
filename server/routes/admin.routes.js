const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/isAdmin");
const {
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/admin.controller");

router.use(isAuthenticated, isAdmin);

router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);
// router.get("/users", getAllUsers);
// router.delete("/users/:id", deleteUser);
// router.get("/stats", getDashboardStats);

module.exports = router;
