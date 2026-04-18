const AsyncHandler = require("../utils/AsyncError");
const ApiError = require("../utils/ApiError");
const { createProduct } = require("../service/product.service");
const { validateCreateProduct } = require("../validator/product.validator");
const { uploadToCloudinary } = require("../utils/cloudinary.utils");

exports.createProduct = AsyncHandler(async (req, res) => {
  // Step 1 — Validate karo
  validateCreateProduct(req.body);

  // Step 2 — Images upload karo Cloudinary pe
  const images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const { public_id, url } = await uploadToCloudinary(
        file,
        "ecommerce/products",
      );
      images.push({ public_id, url });
    }
  }

  // Step 3 — Service ko do
  const product = await createProduct({
    ...req.body,
    images,
    createdBy: req.user._id, // auth middleware se aata hai
  });

  // Step 4 — Response bhejo
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});
