import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/ui/Input";
import { fetchProducts } from "../../redux/slices/productSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { createCollection } from "../../redux/slices/collectionsSlice";

const CreateCollection = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const { error, loading } = useSelector((state) => state.collection);
  const { categories } = useSelector((state) => state.category);

  const [data, setData] = useState({
    name: "",
    description: "",
    image: null,
    type: "manual", // schema: "manual" | "smart"
    products: [],
    rules: {
      category: "",
      categoryIn: [],
      brand: "",
      gender: "",
      minPrice: "",
      maxPrice: "",
    },
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // ─── Text/select inputs (top-level fields) ──────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ─── Rules ke andar ke fields (nested state) ────────
  const handleRuleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      rules: { ...prev.rules, [name]: value },
    }));
  };

  // ─── categoryIn multi-select checkbox toggle ────────
  const toggleCategoryIn = (categoryId) => {
    setData((prev) => {
      const already = prev.rules.categoryIn.includes(categoryId);
      return {
        ...prev,
        rules: {
          ...prev.rules,
          categoryIn:
            already ?
              prev.rules.categoryIn.filter((id) => id !== categoryId)
            : [...prev.rules.categoryIn, categoryId],
        },
      };
    });
  };

  // ─── Image upload + preview ─────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  // ─── Product multi-select (manual collection ke liye) ─
  const toggleProduct = (productId) => {
    setData((prev) => {
      const already = prev.products.includes(productId);
      return {
        ...prev,
        products:
          already ?
            prev.products.filter((id) => id !== productId)
          : [...prev.products, productId],
      };
    });
  };

  // ─── Submit ──────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.name.trim()) {
      alert("Collection name required hai");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("type", data.type);
    if (data.image) formData.append("image", data.image);

    if (data.type === "manual") {
      formData.append("products", JSON.stringify(data.products));
    } else {
      // smart type — sirf jo fields bhare hain unhi ko bhejo
      const cleanedRules = {};
      if (data.rules.category) cleanedRules.category = data.rules.category;
      if (data.rules.categoryIn.length)
        cleanedRules.categoryIn = data.rules.categoryIn;
      if (data.rules.brand) cleanedRules.brand = data.rules.brand;
      if (data.rules.gender) cleanedRules.gender = data.rules.gender;
      if (data.rules.minPrice) cleanedRules.minPrice = data.rules.minPrice;
      if (data.rules.maxPrice) cleanedRules.maxPrice = data.rules.maxPrice;

      formData.append("rules", JSON.stringify(cleanedRules));
    }

    dispatch(createCollection(formData));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>
        )}

        <Input
          label="Name"
          type="text"
          name="name"
          value={data.name}
          placeholder="Please enter collection name"
          onChange={handleChange}
        />

        <div>
          <label className="text-sm font-medium text-[#1d1d1f] mb-1 block">
            Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="mt-2 w-24 h-24 object-cover rounded-lg border border-gray-200"
            />
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-[#1d1d1f] mb-1 block">
            Description
          </label>
          <textarea
            name="description"
            value={data.description}
            placeholder="Please enter description"
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#1d1d1f] mb-1 block">
            Type
          </label>
          <select
            name="type"
            value={data.type}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
          >
            <option value="manual">Manual</option>
            <option value="smart">Smart</option>
          </select>
        </div>

        {/* ─── MANUAL: product selection ─── */}
        {data.type === "manual" && (
          <div>
            <label className="text-sm font-medium text-[#1d1d1f] mb-1 block">
              Choose products
            </label>
            {loading && (
              <p className="text-sm text-gray-500">Loading products...</p>
            )}
            {!loading && products?.length === 0 && (
              <p className="text-sm text-gray-500">No products found</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-xl p-3">
              {products?.map((element) => (
                <label
                  key={element._id}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                    data.products.includes(element._id) ?
                      "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={data.products.includes(element._id)}
                    onChange={() => toggleProduct(element._id)}
                  />
                  <img
                    className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                    src={element.image?.url}
                    alt={element.name}
                  />
                  <div className="text-xs">
                    <p className="font-medium truncate w-20">{element.name}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ─── SMART: rules (category, categoryIn, brand, gender, price range) ─── */}
        {data.type === "smart" && (
          <div className="space-y-4 border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-[#1d1d1f]">
              Smart Collection Rules
            </p>

            <div>
              <label className="text-sm font-medium text-[#1d1d1f] mb-1 block">
                Category (single)
              </label>
              <select
                name="category"
                value={data.rules.category}
                onChange={handleRuleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="">Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#1d1d1f] mb-1 block">
                Category In (multiple)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-3">
                {categories?.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={data.rules.categoryIn.includes(cat._id)}
                      onChange={() => toggleCategoryIn(cat._id)}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            <Input
              label="Brand"
              type="text"
              name="brand"
              value={data.rules.brand}
              placeholder="e.g. Nike"
              onChange={handleRuleChange}
            />

            <div>
              <label className="text-sm font-medium text-[#1d1d1f] mb-1 block">
                Gender
              </label>
              <select
                name="gender"
                value={data.rules.gender}
                onChange={handleRuleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="">Select Gender</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Min Price"
                type="number"
                name="minPrice"
                value={data.rules.minPrice}
                placeholder="0"
                onChange={handleRuleChange}
              />
              <Input
                label="Max Price"
                type="number"
                name="maxPrice"
                value={data.rules.maxPrice}
                placeholder="10000"
                onChange={handleRuleChange}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Collection"}
        </button>
      </form>
    </div>
  );
};

export default CreateCollection;
