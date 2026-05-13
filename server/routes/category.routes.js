const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategoryById,
} = require("../controllers/category.controller.js");
const { isAuthenticated } = require("../middleware/auth.middleware");

router.post("/", isAuthenticated, createCategory);
router.get("/", getAllCategory);
router.get("/:id", getCategoryById);
router.put("/:id", isAuthenticated, updateCategory);
router.delete("/:id", isAuthenticated, deleteCategoryById);

module.exports = router;
