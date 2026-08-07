const mongoose = require("mongoose");
const AsyncHandler = require("../utils/AsyncHandle");
const ApiError = require("../utils/ApiError");
const {
  createProduct,
  getAllProducts,
  getbyid,
  getBySlug,
  getProductsByCollection, // 👈 naya import
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
  validateCreateProduct(req.body);

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

  const product = await createProduct({
    ...req.body,
    images,
    createdBy: req.user._id,
  });

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

// 👇 naya — collection (jaise "men", "women", "all") se products laata hai
exports.getByCollection = AsyncHandler(async (req, res) => {
  const { collectionSlug } = req.params;

  const products = await getProductsByCollection(collectionSlug);

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    count: products.length,
    products,
  });
});

// 👇 getById aur getBySlug ki jagah — ek hi function, id ya slug dono handle karega
exports.getProduct = AsyncHandler(async (req, res) => {
  const { identifier } = req.params; // 👈 bug fix yahan

  let product;

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    product = await getbyid(identifier);
  } else {
    product = await getBySlug(identifier);
  }

  if (!product) throw new ApiError("Product not found", 404);

  res.status(200).json({
    success: true,
    message: "Product found successfully",
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

  await deletebyid(id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

exports.updateById = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  checkId(id);

  const product = await getbyid(id);
  if (!product) throw new ApiError("Product not found", 404);

  if (req.files && req.files.length > 0) {
    for (const image of product.images) {
      await deleteFromCloudinary(image.public_id);
    }

    const images = [];
    for (const file of req.files) {
      const { public_id, url } = await uploadToCloudinary(
        file,
        "ecommerce/products",
      );
      images.push({ public_id, url });
    }

    req.body.images = images;
  }

  const updated = await updateProduct(id, req.body);

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updated,
  });
});
