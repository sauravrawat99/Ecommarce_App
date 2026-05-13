const AsyncHandle = require("../utils/AsyncHandle");
const ApiError = require("../utils/ApiError");
const { validatorCategory } = require("../validator/category.validator");
const {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../service/category.service");
const { checkId } = require("../validator/product.validator");

exports.createCategory = AsyncHandle(async (req, res) => {
  validatorCategory(req.body);

  const newCategory = await createCategory(req.body);

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    newCategory,
  });
});

exports.getAllCategory = AsyncHandle(async (req, res) => {
  const allcategory = await getAllCategory();
  res.status(200).json({
    // ✅ 200
    success: true,
    message: "Categories fetched successfully", // ✅
    count: allcategory.length, // ✅ bonus
    allcategory,
  });
});

exports.getCategoryById = AsyncHandle(async (req, res) => {
  const { id } = req.params;
  checkId(id);

  const category = await getCategoryById(id);

  res.status(200).json({
    success: true,
    message: "category find successfully",
    category,
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
    // ✅ 200
    success: true,
    message: "Category deleted successfully",
  });
});
