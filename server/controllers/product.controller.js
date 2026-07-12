const AsyncHandler = require("../utils/AsyncHandle");
const ApiError = require("../utils/ApiError");
const {
  createProduct,
  getAllProducts,
  getbyid,
  deletebyid,
  updateProduct,
} = require("../service/product.Service");
const {
  validateCreateProduct,
  checkId,
} = require("../validator/product.validator");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/Cloudinary.utils");

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

exports.getAllProducts = AsyncHandler(async (req, res) => {
  const product = await getAllProducts();
  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    product,
  });
});

exports.getById = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  checkId(id);

  const product = await getbyid(id);
  if (!product) throw new ApiError("Product not found", 404);

  res.status(200).json({
    success: true,
    massage: "prodcts find successfully",
    product,
  });
});

exports.deletebyId = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  checkId(id);

  const product = await getbyid(id);
  if (!product) throw new ApiError("Product not found", 404);

  for (const image of product.images) {
    await deleteFromCloudinary(image.public_id);
  }

  // Step 3 — MongoDB se delete karo
  await deletebyid(id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

exports.updateById = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  checkId(id);

  // Product exist karta hai?
  const product = await getbyid(id);
  if (!product) throw new ApiError("Product not found", 404);

  // Nayi images aai hain?
  if (req.files && req.files.length > 0) {
    // Purani images Cloudinary se delete karo
    for (const image of product.images) {
      await deleteFromCloudinary(image.public_id);
    }

    // Nayi images upload karo
    const images = [];
    for (const file of req.files) {
      const { public_id, url } = await uploadToCloudinary(
        file,
        "ecommerce/products",
      );
      images.push({ public_id, url });
    }

    // req.body mein daalo
    req.body.images = images;
  }

  // MongoDB mein update karo
  const updated = await updateProduct(id, req.body);

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updated,
  });
});
