const express = require("express");
const router = express.Router();
const {
  createAddress,
  getUserAddresses,
  setDefaultAddress,
  deleteAddress,
} = require("../controllers/address.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");

router.post("/", isAuthenticated, createAddress);
router.get("/", isAuthenticated, getUserAddresses);
router.put("/:id/set-default", isAuthenticated, setDefaultAddress);
router.delete("/:id", isAuthenticated, deleteAddress);

module.exports = router;
