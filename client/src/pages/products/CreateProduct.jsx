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

  // Product form ka data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [], // 🆕 ab ye File objects ka array rakhega
  });

  // 🆕 Preview ke liye alag se URLs store karenge
  const [previewUrls, setPreviewUrls] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Page khulte hi categories fetch karo
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // 🆕 Cleanup — preview URLs ko revoke karo jab component unmount ho
  // ya naya selection ho (memory leak se bachne ke liye)
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🆕 Image input ke liye ALAG handler — text input wale se mix nahi karna
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // FileList -> normal array

    if (files.length === 0) return;

    // formData mein actual File objects store karo (upload ke liye)
    setFormData({ ...formData, images: files });

    // Preview dikhane ke liye temporary URLs banao
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
  };

  // 🆕 Ek image ko preview se remove karne ke liye (optional but useful)
  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);

    setFormData({ ...formData, images: updatedImages });
    setPreviewUrls(updatedPreviews);
  };

  // Jab dropdown mein selection ho
  const handleCategoryChange = (e) => {
    const value = e.target.value;

    if (value === "ADD_NEW") {
      setShowModal(true);
    } else {
      setFormData({ ...formData, category: value });
    }
  };

  // Naya category create karo
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

  // 🆕 Submit handler — ab FormData use karega, plain object nahi
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation — kam se kam ek image honi chahiye
    if (formData.images.length === 0) {
      alert("Please select at least one image"); // ya apna toast/error UI use karo
      return;
    }

    const productFormData = new FormData();
    productFormData.append("name", formData.name);
    productFormData.append("description", formData.description);
    productFormData.append("price", formData.price);
    productFormData.append("category", formData.category);
    productFormData.append("stock", formData.stock);

    // Multiple files same field name "images" se append karo
    // Backend (multer) isi naam se expect karta hai
    formData.images.forEach((file) => {
      productFormData.append("images", file);
    });

    dispatch(createProduct(productFormData));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center relative">
      <div className="bg-white rounded-3xl shadow-sm p-10 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-8">Add Product</h1>

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

          {/* Category Dropdown */}
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

          {/* 🆕 IMAGE UPLOAD — alag handler, no value prop */}
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200
                         focus:outline-none focus:border-blue-500 text-sm
                         file:mr-3 file:py-1 file:px-3 file:rounded-lg
                         file:border-0 file:bg-blue-50 file:text-blue-600
                         file:text-sm file:cursor-pointer cursor-pointer"
            />
          </div>

          {/* 🆕 Image Previews */}
          {previewUrls.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={url}
                    alt={`preview-${index}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
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

        {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      </div>

      {/* POPUP / MODAL — sirf showModal true hone pe dikhega */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Add New Category</h2>

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
