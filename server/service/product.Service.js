const Product = require("../models/product.model");
const Category = require("../models/category.model"); // 👈 naya import
const ApiError = require("../utils/ApiError"); // 👈 naya import

// Naya helper function — unique slug banane ke liye
const generateUniqueSlug = async (name) => {
  let baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  let slug = baseSlug;
  let counter = 1;

  while (await Product.exists({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

exports.createProduct = async (productData) => {
  const slug = await generateUniqueSlug(productData.name);

  const product = await Product.create({
    ...productData,
    slug,
  });

  return product;
};

exports.getAllProducts = async () => {
  return await Product.find();
};

exports.getbyid = async (id) => {
  return await Product.findById(id); // 👈 bug fix — { _id } nahi, seedha id
};

exports.deletebyid = async (id) => {
  await Product.findByIdAndDelete(id);
};

exports.updateProduct = async (id, updateData) => {
  return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

exports.getBySlug = async (slug) => {
  return await Product.findOne({ slug });
};

// 👇 naya function — collection slug se filter karke products laata hai
exports.getProductsByCollection = async (collectionSlug) => {
  let filter = {};

  if (collectionSlug !== "all" && collectionSlug !== "featured-all") {
    // slug (jaise "men") se category dhundo, case-insensitive
    const category = await Category.findOne({
      name: new RegExp(`^${collectionSlug}$`, "i"),
    });

    if (!category) {
      throw new ApiError("Collection not found", 404);
    }

    filter.category = category._id;
  }

  if (collectionSlug === "featured-all") {
    filter.isFeatured = true;
  }

  const products = await Product.find(filter).populate("category", "name");
  return products;
};

exports.searchProducts = async (query) => {
  if (!query || !query.trim()) return [];
  const regex = new RegExp(query.trim(), "i");

  const products = await Product.find({
    $or: [{ name: regex }, { brand: regex }, { description: regex }],
  });

  return products;
};
