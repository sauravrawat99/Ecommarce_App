const AsyncHandle = require("../utils/AsyncHandle");
const ApiError = require("../utils/ApiError");
const { validatorCategory } = require("../validator/category.validator");
const {
  createCategory,
  getAllCategory,
  getCategoryTree,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../service/category.service");
const { checkId } = require("../validator/product.validator");

exports.createCategory = AsyncHandle(async (req, res) => {
  const { name } = req.body;
  validatorCategory(name);

  const newCategory = await createCategory(req.body); // req.body mein parent bhi ab use ho rahi hai

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    newCategory,
  });
});

exports.getAllCategory = AsyncHandle(async (req, res) => {
  const allcategory = await getAllCategory();
  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    count: allcategory.length,
    allcategory,
  });
});

// 👇 naya endpoint — mega menu ke liye nested tree
exports.getCategoryTree = AsyncHandle(async (req, res) => {
  const tree = await getCategoryTree();
  res.status(200).json({
    success: true,
    message: "Category tree fetched successfully",
    tree,
  });
});

exports.getCategoryById = AsyncHandle(async (req, res) => {
  const { id } = req.params;
  checkId(id);

  const result = await getCategoryById(id); // ab { category, subCategories } return hota hai

  res.status(200).json({
    success: true,
    message: "category find successfully",
    ...result,
  });
});

exports.updateCategory = AsyncHandle(async (req, res) => {
  const { id } = req.params;
  checkId(id);

  const category = await updateCategory(id, req.body);
  if (!category) throw new ApiError("Category not found", 404);

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category,
  });
});

exports.deleteCategoryById = AsyncHandle(async (req, res) => {
  const { id } = req.params;
  checkId(id);

  await deleteCategory(id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
