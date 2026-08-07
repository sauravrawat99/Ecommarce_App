const Collection = require("../models/collections.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/ApiError");

exports.createCollection = async (collectionData) => {
  return await Collection.create(collectionData);
};

exports.getAllCollections = async () => {
  return await Collection.find({ isActive: true });
};

// 👇 sabse important function — slug se collection + uske products laata hai
exports.getCollectionBySlug = async (slug) => {
  const collection = await Collection.findOne({ slug, isActive: true });
  if (!collection) throw new ApiError("Collection not found", 404);

  let products;

  if (collection.type === "manual") {
    // seedha jo products array mein hain, wahi nikaalo

    products = await Product.find({ _id: { $in: collection.products } });
  } else {
    // smart collection — rules se dynamic filter banao
    const filter = {};
    if (collection.rules?.category) filter.category = collection.rules.category;
    if (collection.rules?.categoryIn)
      filter.category = { $in: collection.rules.categoryIn }; // 👈 naya
    if (collection.rules?.brand) filter.brand = collection.rules.brand;
    if (collection.rules?.minPrice || collection.rules?.maxPrice) {
      filter.price = {};
      if (collection.rules.minPrice)
        filter.price.$gte = collection.rules.minPrice;
      if (collection.rules.maxPrice)
        filter.price.$lte = collection.rules.maxPrice;
    }
    products = await Product.find(filter);
  }

  return { collection, products };
};

exports.updateCollection = async (id, updateData) => {
  const collection = await Collection.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!collection) throw new ApiError("Collection not found", 404);
  return collection;
};

exports.deleteCollection = async (id) => {
  const collection = await Collection.findByIdAndDelete(id);
  if (!collection) throw new ApiError("Collection not found", 404);
};
