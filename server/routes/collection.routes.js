const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createCollection,
  getAllCollections,
  getCollectionBySlug,
  updateCollection,
  deleteCollection,
  getCollectionById,
} = require("../controllers/collections.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/isAdmin");

// agar already koi multer config file hai (jaise middleware/upload.js), wahi import kar
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  isAuthenticated,
  isAdmin,
  upload.single("image"), // 👈 ye missing tha
  createCollection,
);
router.get("/", getAllCollections);
router.get("/:slug", getCollectionBySlug);
router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  upload.single("image"), // update mein bhi image change ho sakta hai
  updateCollection,
);
router.delete("/:id", isAuthenticated, isAdmin, deleteCollection);
router.get("/id/:id", isAuthenticated, isAdmin, getCollectionById);
module.exports = router;
