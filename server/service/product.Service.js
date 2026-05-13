const Product = require("../models/product.model");

// Sirf DB se baat karo — req/res nahi!
exports.createProduct = async (productData) => {
  const product = await Product.create(productData);
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
  return await Product.findByIdAndUpdate(
    id,
    updateData,
    { new: true }, // ✅ updated product wapas do
  );
};
