const Collection = require("../models/collections.model");
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");

exports.createCollection = async (collectionData) => {
  return await Collection.create(collectionData);
};

exports.getAllCollections = async () => {
  return await Collection.find({ isActive: true });
};

// ==========================================
// Helper: "Red,Blue" jaisi comma-separated string
// ko array mein convert karta hai: ["Red", "Blue"]
// ==========================================
const parseMulti = (value) => {
  if (!value) return null;
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
};

// ==========================================
// Facet counts nikalne wala helper
// scopeFilter = sirf collection ka scope (manual products ya smart rules)
// interactive filters (jo user select karta hai) isme include nahi hain
// taaki sidebar mein hamesha total available options dikhein
// ==========================================
const getCollectionFacets = async (scopeFilter) => {
  const [result] = await Product.aggregate([
    { $match: scopeFilter },
    {
      $facet: {
        brands: [
          { $group: { _id: "$brand", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
        categories: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
        sizes: [
          { $unwind: "$variants" },
          { $group: { _id: "$variants.size", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
        colors: [
          { $unwind: "$variants" },
          { $group: { _id: "$variants.color", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
        priceRanges: [
          {
            $bucket: {
              groupBy: "$price",
              boundaries: [0, 2000, 4000, 6000, 8000],
              default: "8000+",
              output: { count: { $sum: 1 } },
            },
          },
        ],
      },
    },
  ]);

  // categories mein sirf ID hai, naam Category collection se laao
  const categoryIds = result.categories.map((c) => c._id).filter(Boolean);
  const categoryDocs = await Category.find({
    _id: { $in: categoryIds },
  }).select("name");

  const categoryMap = {};
  categoryDocs.forEach((c) => {
    categoryMap[c._id.toString()] = c.name;
  });

  return {
    brands: result.brands.map((b) => ({ value: b._id, count: b.count })),
    categories: result.categories.map((c) => ({
      value: c._id,
      label: categoryMap[c._id?.toString()] || c._id,
      count: c.count,
    })),
    sizes: result.sizes.map((s) => ({ value: s._id, count: s.count })),
    colors: result.colors.map((c) => ({ value: c._id, count: c.count })),
    priceRanges: result.priceRanges.map((p) => ({
      value: p._id,
      count: p.count,
    })),
  };
};

// ==========================================
// Main function — collection + products + facets sab ek saath
// ==========================================
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

  // ------------------------------------------
  // Collection Scope Filter — yeh define karta hai
  // ki is collection ke andar konse products aate hain
  // ------------------------------------------
  let scopeFilter = {};
  if (collection.type === "manual") {
    scopeFilter._id = { $in: collection.products };
  } else {
    if (collection.rules?.category)
      scopeFilter.category = collection.rules.category;
    if (collection.rules?.categoryIn)
      scopeFilter.category = { $in: collection.rules.categoryIn };
    if (collection.rules?.brand) scopeFilter.brand = collection.rules.brand;
  }

  // ------------------------------------------
  // Interactive Filters (checkboxes se aa rahe hain)
  // ab multi-select support karte hain
  // ------------------------------------------
  const brandList = parseMulti(brand);

  // ✅ FIX: category IDs ko string se ObjectId mein convert kiya
  // kyunki $match aggregation stage auto-cast nahi karta (find() ke unlike)
  const categoryList = parseMulti(category)?.map(
    (id) => new mongoose.Types.ObjectId(id),
  );

  const sizeList = parseMulti(size);
  const colorList = parseMulti(color);

  let filter = { ...scopeFilter };

  if (brandList) filter.brand = { $in: brandList };
  if (categoryList) filter.category = { $in: categoryList };

  if (sizeList || colorList) {
    filter.variants = { $elemMatch: {} };
    if (sizeList) {
      filter.variants.$elemMatch.size = {
        $in: sizeList.map((s) => s.toUpperCase()),
      };
    }
    if (colorList) filter.variants.$elemMatch.color = { $in: colorList };
  }

  if (minPrice || maxPrice) {
    filter.price = filter.price || {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // ------------------------------------------
  // Sorting
  // ------------------------------------------
  let sortOption = {};
  if (sort_by === "price-low-high") sortOption = { price: 1 };
  else if (sort_by === "price-high-low") sortOption = { price: -1 };
  else if (sort_by === "alpha-asc") sortOption = { name: 1 };
  else if (sort_by === "alpha-desc") sortOption = { name: -1 };
  else if (sort_by === "date-old-new") sortOption = { createdAt: 1 };
  else if (sort_by === "date-new-old") sortOption = { createdAt: -1 };

  // ------------------------------------------
  // Pagination
  // ------------------------------------------
  const currentPage = Number(page) || 1;
  const perPage = Number(limit) || 10;
  const skipCount = (currentPage - 1) * perPage;

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
                sizeList ?
                  { $in: ["$$v.size", sizeList.map((s) => s.toUpperCase())] }
                : true,
                colorList ? { $in: ["$$v.color", colorList] } : true,
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

  // ------------------------------------------
  // Facets — sidebar counts (collection scope pe based, interactive filters pe nahi)
  // ------------------------------------------
  const facets = await getCollectionFacets(scopeFilter);

  return {
    collection,
    products,
    pagination: {
      currentPage,
      perPage,
      totalCount,
      totalPages: Math.ceil(totalCount / perPage),
    },
    facets,
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

exports.getCollectionById = async (id) => {
  const collection = await Collection.findById(id);
  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }
  return collection;
};
