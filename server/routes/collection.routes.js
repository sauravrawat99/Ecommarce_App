const express = require("express");
const router = express.Router();
const {
  createCollection,
  getAllCollections,
  getCollectionBySlug,
  updateCollection,
  deleteCollection,
} = require("../controllers/collections.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/isAdmin");

router.post("/", isAuthenticated, isAdmin, createCollection);
router.get("/", getAllCollections);
router.get("/:slug", getCollectionBySlug); // 👈 one8 jaisa /collections/men-running
router.put("/:id", isAuthenticated, isAdmin, updateCollection);
router.delete("/:id", isAuthenticated, isAdmin, deleteCollection);

module.exports = router;
