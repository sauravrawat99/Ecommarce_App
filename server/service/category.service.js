const Category = require("../models/category.model");
const ApiError = require("../utils/ApiError");

exports.createCategory = async ({ name, description }) => {
  return await Category.create({ name, description });
};

exports.getAllCategory = async () => {
  return await Category.find();
};

exports.getCategoryById = async (id) => {
  const categery = await Category.findById(id);
  if (!categery) {
    throw new ApiError("category not found", 400);
  }
  return categery;
};

exports.updateCategory = async (_id, updateData) => {
  const categery = await Category.findByIdAndUpdate(
    _id,
    updateData,
    //  {new: true,} old way that return warning
    // that is new way
    { returnDocument: "after" },
  );
  if (!categery) {
    throw new ApiError("category not found", 400);
  }
  return categery;
};

exports.deleteCategory = async (_id) => {
  const category = await Category.findByIdAndDelete({ _id });
  if (!category) throw new ApiError("category not found", 400);
};
