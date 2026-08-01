const Category = require("../models/category.model");
const ApiError = require("../utils/ApiError");

exports.createCategory = async ({ name, description, parent }) => {
  // parent agar diya hai, check karo wo exist karta hai ya nahi
  if (parent) {
    const parentExists = await Category.findById(parent);
    if (!parentExists) {
      throw new ApiError("Parent category not found", 404);
    }
  }

  return await Category.create({ name, description, parent: parent || null });
};

exports.getAllCategory = async () => {
  return await Category.find();
};

exports.getCategoryTree = async () => {
  const categories = await Category.find().lean();

  const map = {};
  categories.forEach((cat) => {
    map[cat._id] = { ...cat, children: [] };
  });

  const tree = [];
  categories.forEach((cat) => {
    if (cat.parent) {
      map[cat.parent]?.children.push(map[cat._id]);
    } else {
      tree.push(map[cat._id]);
    }
  });

  return tree;
};

exports.getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError("category not found", 400);
  }

  const subCategories = await Category.find({ parent: id });
  return { category, subCategories };
};

exports.updateCategory = async (_id, updateData) => {
  const category = await Category.findByIdAndUpdate(_id, updateData, {
    returnDocument: "after",
  });
  if (!category) {
    throw new ApiError("category not found", 400);
  }
  return category;
};

exports.deleteCategory = async (_id) => {
  // agar iske andar subcategories hain, delete block karo
  const hasChildren = await Category.exists({ parent: _id });
  if (hasChildren) {
    throw new ApiError("Delete subcategories first", 400);
  }

  const category = await Category.findByIdAndDelete({ _id });
  if (!category) throw new ApiError("category not found", 400);
};
