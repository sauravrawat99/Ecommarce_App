import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

import { getBySlug } from "../../redux/slices/collectionsSlice";

import SlugCard from "./SlugCard";
import Pagination from "./Pagination";

// ==========================================
// Fixed Price Buckets (backend ke boundaries se match karte hain)
// ==========================================
const PRICE_RANGES = [
  { min: 0, max: 2000, label: "₹0 - ₹2,000" },
  { min: 2000, max: 4000, label: "₹2,000 - ₹4,000" },
  { min: 4000, max: 6000, label: "₹4,000 - ₹6,000" },
  { min: 6000, max: 8000, label: "₹6,000 - ₹8,000" },
];

const Slug = () => {
  const dispatch = useDispatch();

  const { slug } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const { loading, error, products, collection, pagination, facets } =
    useSelector((state) => state.collection);

  // ==========================================
  // URL se values (multi-select fields ab arrays hain)
  // ==========================================

  const page = Number(searchParams.get("page")) || 1;

  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const selectedBrands =
    searchParams.get("brand")?.split(",").filter(Boolean) || [];
  const selectedCategories =
    searchParams.get("category")?.split(",").filter(Boolean) || [];
  const selectedSizes =
    searchParams.get("size")?.split(",").filter(Boolean) || [];
  const selectedColors =
    searchParams.get("color")?.split(",").filter(Boolean) || [];

  const sort_by = searchParams.get("sort_by") || "";

  const limit = Number(searchParams.get("limit")) || 10;

  const selectedBrandsParam = selectedBrands.join(",");
  const selectedCategoriesParam = selectedCategories.join(",");
  const selectedSizesParam = selectedSizes.join(",");
  const selectedColorsParam = selectedColors.join(",");

  // ==========================================
  // Clean Filters — API ke liye arrays ko comma string mein badlo
  // ==========================================

  const filters = useMemo(
    () => ({
      limit,
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
      ...(selectedBrandsParam && { brand: selectedBrandsParam }),
      ...(selectedCategoriesParam && { category: selectedCategoriesParam }),
      ...(selectedSizesParam && { size: selectedSizesParam }),
      ...(selectedColorsParam && { color: selectedColorsParam }),
      ...(sort_by && { sort_by }),
    }),
    [
      limit,
      minPrice,
      maxPrice,
      selectedBrandsParam,
      selectedCategoriesParam,
      selectedSizesParam,
      selectedColorsParam,
      sort_by,
    ],
  );

  // ==========================================
  // API CALL
  // ==========================================

  useEffect(() => {
    dispatch(
      getBySlug({
        slug,
        filters,
        page,
      }),
    );
  }, [
    dispatch,
    slug,
    page,
    filters,
  ]);

  // ==========================================
  // Checkbox Toggle — multi-select filters ke liye
  // ==========================================

  const toggleFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    const current = params.get(key)?.split(",").filter(Boolean) || [];

    let updated;
    if (current.includes(value)) {
      updated = current.filter((v) => v !== value); // uncheck
    } else {
      updated = [...current, value]; // check
    }

    if (updated.length > 0) {
      params.set(key, updated.join(","));
    } else {
      params.delete(key);
    }

    params.set("page", "1");
    setSearchParams(params);
  };

  // ==========================================
  // Price Range Toggle (single-select behave karta hai, one8 jaisa)
  // ==========================================

  const togglePriceRange = (rangeMin, rangeMax) => {
    const params = new URLSearchParams(searchParams);

    const isActive =
      params.get("minPrice") === String(rangeMin) &&
      params.get("maxPrice") === String(rangeMax);

    if (isActive) {
      // dobara click => clear
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      params.set("minPrice", rangeMin);
      params.set("maxPrice", rangeMax);
    }

    params.set("page", "1");
    setSearchParams(params);
  };

  // ==========================================
  // Sorting
  // ==========================================

  const handleSort = (value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("sort_by", value);
    } else {
      params.delete("sort_by");
    }

    params.set("page", "1");
    setSearchParams(params);
  };

  // ==========================================
  // Clear Filters (sort_by ko touch nahi karta)
  // ==========================================

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams);

    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("brand");
    params.delete("category");
    params.delete("size");
    params.delete("color");

    params.set("page", "1");
    params.set("limit", "10");

    setSearchParams(params);
  };

  // ==========================================
  // Pagination
  // ==========================================

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ==========================================
  // Loading / Error
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <h2 className="text-xl font-semibold">Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <h2 className="text-xl text-red-500">{error}</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {collection?.name || slug}{" "}
          <span className="text-lg font-normal text-gray-500">
            {pagination?.totalCount || 0} Products
          </span>
        </h1>
        {collection?.description && (
          <p className="text-gray-600 mt-2">{collection.description}</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* =====================================
            SIDEBAR — FACETED FILTERS
        ====================================== */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Filters</h2>
            <button
              onClick={handleClearFilters}
              className="text-sm underline hover:text-gray-600"
            >
              Clear All
            </button>
          </div>

          {/* Price */}
          <div className="border-b pb-4 mb-4">
            <h3 className="font-semibold mb-3">PRICE</h3>
            <div className="space-y-2">
              {PRICE_RANGES.map((range) => {
                const isChecked =
                  minPrice === String(range.min) &&
                  maxPrice === String(range.max);
                return (
                  <label
                    key={range.label}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => togglePriceRange(range.min, range.max)}
                    />
                    <span>{range.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Category */}
          {facets?.categories?.length > 0 && (
            <div className="border-b pb-4 mb-4">
              <h3 className="font-semibold mb-3">CATEGORY</h3>
              <div className="space-y-2">
                {facets.categories.map((cat) => (
                  <label
                    key={cat.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.value)}
                      onChange={() => toggleFilter("category", cat.value)}
                    />
                    <span>
                      {cat.label} ({cat.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Brand */}
          {facets?.brands?.length > 0 && (
            <div className="border-b pb-4 mb-4">
              <h3 className="font-semibold mb-3">BRAND</h3>
              <div className="space-y-2">
                {facets.brands.map((b) => (
                  <label
                    key={b.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b.value)}
                      onChange={() => toggleFilter("brand", b.value)}
                    />
                    <span>
                      {b.value} ({b.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {facets?.sizes?.length > 0 && (
            <div className="border-b pb-4 mb-4">
              <h3 className="font-semibold mb-3">SIZE</h3>
              <div className="space-y-2">
                {facets.sizes.map((s) => (
                  <label
                    key={s.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(s.value)}
                      onChange={() => toggleFilter("size", s.value)}
                    />
                    <span>
                      {s.value} ({s.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Color */}
          {facets?.colors?.length > 0 && (
            <div className="pb-4 mb-4">
              <h3 className="font-semibold mb-3">COLOR</h3>
              <div className="space-y-2">
                {facets.colors.map((c) => (
                  <label
                    key={c.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(c.value)}
                      onChange={() => toggleFilter("color", c.value)}
                    />
                    <span>
                      {c.value} ({c.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* =====================================
            MAIN CONTENT
        ====================================== */}
        <div className="flex-1">
          {/* Sort */}
          <div className="flex justify-end mb-5">
            <select
              value={sort_by}
              onChange={(e) => handleSort(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="alpha-asc">Name: A-Z</option>
              <option value="alpha-desc">Name: Z-A</option>
              <option value="date-new-old">Newest</option>
              <option value="date-old-new">Oldest</option>
            </select>
          </div>

          {/* Products */}
          {products?.length === 0 ?
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold">No Products Found</h2>
              <p className="text-gray-500 mt-2">Try changing your filters.</p>
            </div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 h-screen gap-6">
              {products.map((product) => (
                <SlugCard key={product._id} props={product} />
              ))}
            </div>
          }

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Slug;
