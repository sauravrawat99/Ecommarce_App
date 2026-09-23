const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getByCollection, // 👈 naya import add kiya
  getProduct, // 👈 ab id + slug dono yahi handle karega
  deletebyId,
  updateById,
  searchProducts,
} = require("../controllers/product.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/isAdmin");
const upload = require("../middleware/multer");

router.post(
  "/create",
  isAuthenticated,
  isAdmin,
  upload.array("images", 5),
  createProduct,
);

router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  upload.array("images", 5),
  updateById,
);

router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/collections/:collectionSlug", getByCollection); // 👈 naya route — YAHAN, /:identifier se PEHLE
router.get("/:identifier", getProduct); // 👈 ek hi route — id ya slug dono
router.delete("/:id", isAuthenticated, isAdmin, deletebyId);

module.exports = router;
