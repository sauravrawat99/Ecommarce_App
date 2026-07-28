import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import {
  fetchProductById,
  updateProduct,
} from "../../redux/slices/productSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.category);

  const [formData, setFormData] = useState({});

  // Naya image select kiya to yahan rakhenge (agar user replace karna chahe)
  const [newImages, setNewImages] = useState([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchCategories());
  }, [dispatch, id]);

  useEffect(() => {
    return () => {
      newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newPreviewUrls]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setNewImages(files);
    setNewPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);

    const productFormData = new FormData();
    productFormData.append("name", formData.name);
    productFormData.append("description", formData.description);
    productFormData.append("price", formData.price);
    productFormData.append("category", formData.category);
    productFormData.append("stock", formData.stock);

    // Sirf tab images bhejo jab user ne naya select kiya ho
    // (agar nahi kiya, backend ko purani images intact rakhni chahiye)
    newImages.forEach((file) => {
      productFormData.append("images", file);
    });

    const result = await dispatch(
      updateProduct({ id, productData: productFormData }),
    );

    if (result.meta.requestStatus === "fulfilled") {
      setSaved(true);
      setTimeout(() => navigate("/admin/products"), 1000);
    }
  };

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center relative px-4 py-8 sm:px-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-10 w-full max-w-md">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>

        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 sm:mb-8">
          Edit Product
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
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200
               focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
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

          {/* Current images preview */}
          {product?.images?.length > 0 && newPreviewUrls.length === 0 && (
            <div>
              <label className="text-sm font-medium text-[#1d1d1f] mb-1 block">
                Current Images
              </label>
              <div className="flex flex-wrap gap-3">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={`current-${index}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-[#1d1d1f] mb-1 block">
              Replace Images (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full px-3 sm:px-4 py-3 rounded-xl border border-gray-200
                         focus:outline-none focus:border-blue-500 text-sm
                         file:mr-2 sm:file:mr-3 file:py-1 file:px-2 sm:file:px-3 file:rounded-lg
                         file:border-0 file:bg-blue-50 file:text-blue-600
                         file:text-xs sm:file:text-sm file:cursor-pointer cursor-pointer"
            />
            <p className="text-xs text-gray-400 mt-1">
              Khaali chhod do agar images change nahi karni
            </p>
          </div>

          {newPreviewUrls.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {newPreviewUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`new-preview-${index}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-indigo-500"
                />
              ))}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>

        {saved && (
          <p className="text-center mt-4 text-sm text-green-600">
            ✅ Product updated! Redirecting...
          </p>
        )}
        {error && (
          <p className="text-center mt-4 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
