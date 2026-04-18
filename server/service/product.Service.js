const Product = require("../models/product.model");

// Sirf DB se baat karo — req/res nahi!
const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

module.exports = { createProduct };
