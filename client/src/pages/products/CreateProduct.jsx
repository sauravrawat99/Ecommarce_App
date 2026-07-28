import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { createProduct } from "../../redux/slices/productSlice";
import {
  fetchCategories,
  createCategory,
} from "../../redux/slices/categorySlice";

const CreateProduct = () => {
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.category);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [],
  });

  const [previewUrls, setPreviewUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setFormData({ ...formData, images: files });
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
    setPreviewUrls(updatedPreviews);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "ADD_NEW") {
      setShowModal(true);
    } else {
      setFormData({ ...formData, category: value });
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    const result = await dispatch(
      createCategory({ name: newCategoryName, description: newCategoryName }),
    );

    if (result.meta.requestStatus === "fulfilled") {
      const newCat = result.payload;
      setFormData({ ...formData, category: newCat._id });
      setNewCategoryName("");
      setShowModal(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      alert("Please select at least one image");
      return;
    }

    const productFormData = new FormData();
    productFormData.append("name", formData.name);
    productFormData.append("description", formData.description);
    productFormData.append("price", formData.price);
    productFormData.append("category", formData.category);
    productFormData.append("stock", formData.stock);

    formData.images.forEach((file) => {
      productFormData.append("images", file);
    });

    dispatch(createProduct(productFormData));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center relative px-4 py-8 sm:px-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-10 w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 sm:mb-8">
          Add Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
          />
          <Input
            label="Description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
          />
          <Input
            label="Price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
          />

          <div>
            <label className="text-sm font-medium text-[#1d1d1f] mb-1 block">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200
               focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
              <option value="ADD_NEW">➕ Add New Category</option>
            </select>
          </div>

          <Input
            label="Stock"
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Enter stock quantity"
          />

          <div>
            <label className="text-sm font-medium text-[#1d1d1f] mb-1 block">
              Images
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full px-3 sm:px-4 py-3 rounded-xl border border-gray-200
                         focus:outline-none focus:border-blue-500 text-sm
                         file:mr-2 sm:file:mr-3 file:py-1 file:px-2 sm:file:px-3 file:rounded-lg
                         file:border-0 file:bg-blue-50 file:text-blue-600
                         file:text-xs sm:file:text-sm file:cursor-pointer cursor-pointer"
            />
          </div>

          {previewUrls.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative w-16 h-16 sm:w-20 sm:h-20">
                  <img
                    src={url}
                    alt={`preview-${index}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white
                               rounded-full w-5 h-5 text-xs flex items-center
                               justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </form>

        {error && (
          <p className="text-center mt-4 text-red-500 text-sm">{error}</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-sm">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Add New Category
            </h2>

            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200
                         focus:outline-none focus:border-blue-500 text-sm mb-4"
            />

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleCreateCategory}
                className="flex-1"
              >
                Create
              </Button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 text-sm text-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProduct;
