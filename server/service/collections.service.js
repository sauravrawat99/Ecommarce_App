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
exports.getCollectionBySlug = async (slug, queryParams = {}) => {
  const {
    sort_by,
    minPrice,
    maxPrice,
    brand,
    category,
    size,
    color,
    page,
    limit,
  } = queryParams;

  const collection = await Collection.findOne({ slug, isActive: true });
  if (!collection) throw new ApiError("Collection not found", 404);

  
  let sortOption = {};
  if (sort_by === "price-low-high") sortOption = { price: 1 };
  else if (sort_by === "price-high-low") sortOption = { price: -1 };
  else if (sort_by === "alpha-asc") sortOption = { name: 1 };
  else if (sort_by === "alpha-desc") sortOption = { name: -1 };
  else if (sort_by === "date-old-new") sortOption = { createdAt: 1 };
  else if (sort_by === "date-new-old") sortOption = { createdAt: -1 };

  let filter = {};
  if (collection.type === "manual") {
    filter._id = { $in: collection.products };
  } else {
    if (collection.rules?.category) filter.category = collection.rules.category;
    if (collection.rules?.categoryIn)
      filter.category = { $in: collection.rules.categoryIn };
    if (collection.rules?.brand) filter.brand = collection.rules.brand;
  }

  if (size || color) {
    filter.variants = { $elemMatch: {} };
    if (size) filter.variants.$elemMatch.size = size.toUpperCase();
    if (color) filter.variants.$elemMatch.color = color;
  }
  if (brand) filter.brand = brand;
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = filter.price || {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // 👇 Pagination values decide karo
  const currentPage = Number(page) || 1;
  const perPage = Number(limit) || 10;
  const skipCount = (currentPage - 1) * perPage;

  // 👇 Total count nikalo (pagination info ke liye — kitne total pages honge)
  const totalCount = await Product.countDocuments(filter);

  const products = await Product.aggregate([
    { $match: filter },
    {
      $addFields: {
        variants: {
          $filter: {
            input: "$variants",
            as: "v",
            cond: {
              $and: [
                size ? { $eq: ["$$v.size", size.toUpperCase()] } : true,
                color ? { $eq: ["$$v.color", color] } : true,
              ],
            },
          },
        },
      },
    },
    { $sort: Object.keys(sortOption).length ? sortOption : { _id: 1 } },
    { $skip: skipCount },
    { $limit: perPage },
  ]);

  return {
    collection,
    products,
    pagination: {
      currentPage,
      perPage,
      totalCount,
      totalPages: Math.ceil(totalCount / perPage),
    },
  };
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
