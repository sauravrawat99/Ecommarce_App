const multer = require("multer");

// Step 1 — Storage
const storage = multer.memoryStorage();

// Step 2 — FileFilter
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true); // allow
  } else {
    cb(new Error("Only images are allowed!"), false); // block
  }
};

// Step 3 — Upload object
const upload = multer({ storage, fileFilter });

// Step 4 — Export
module.exports = upload;
