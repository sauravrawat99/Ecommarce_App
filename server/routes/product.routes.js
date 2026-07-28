const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getById,
  deletebyId,
  updateById,
} = require("../controllers/product.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/isAdmin");
const upload = require("../middleware/multer");

// POST /api/products
router.post(
  "/",
  isAuthenticated,
  isAdmin, // pehle login check karo
  upload.array("images", 5), // phir images lo — max 5
  createProduct, // phir controller
);

router.get("/", getAllProducts);
router.get("/:id", getById);
router.put("/:id", isAuthenticated, isAdmin, updateById);
router.delete("/:id", isAuthenticated, isAdmin, deletebyId);

module.exports = router;
