const Product = require("../models/product.model");

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

  // jab tak same slug DB mein exist kare, number badhate raho
  while (await Product.exists({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

exports.createProduct = async (productData) => {
  const slug = await generateUniqueSlug(productData.name); // 👈 naya step

  const product = await Product.create({
    ...productData,
    slug, // 👈 productData mein slug add ho gaya
  });

  return product;
};

exports.getAllProducts = async () => {
  return await Product.find();
};

exports.getbyid = async (_id) => {
  return await Product.findById({ _id });
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
