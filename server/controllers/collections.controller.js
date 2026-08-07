const AsyncHandler = require("../utils/AsyncHandle");
const ApiError = require("../utils/ApiError");
const {
  createCollection,
  getAllCollections,
  getCollectionBySlug,
  updateCollection,
  deleteCollection,
} = require("../service/collections.service");

exports.createCollection = AsyncHandler(async (req, res) => {
  const collection = await createCollection(req.body);
  res.status(201).json({
    success: true,
    message: "Collection created successfully",
    collection,
  });
});

exports.getAllCollections = AsyncHandler(async (req, res) => {
  const collections = await getAllCollections();
  res.status(200).json({
    success: true,
    message: "Collections fetched successfully",
    count: collections.length,
    collections,
  });
});

exports.getCollectionBySlug = AsyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { collection, products } = await getCollectionBySlug(slug);

  res.status(200).json({
    success: true,
    message: "Collection fetched successfully",
    collection,
    count: products.length,
    products,
  });
});

exports.updateCollection = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const collection = await updateCollection(id, req.body);
  res.status(200).json({
    success: true,
    message: "Collection updated successfully",
    collection,
  });
});

exports.deleteCollection = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteCollection(id);
  res.status(200).json({
    success: true,
    message: "Collection deleted successfully",
  });
});
