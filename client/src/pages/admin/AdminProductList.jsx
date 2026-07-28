import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts, deleteProduct } from "../../redux/slices/productSlice";
import { Pencil, Trash2, Plus } from "lucide-react";

const AdminProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `"${name}" ko delete karna hai? Ye undo nahi ho sakta.`,
    );
    if (!confirmed) return;

    setDeletingId(id);
    await dispatch(deleteProduct(id));
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-4 sm:px-6 md:px-12 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Manage Products
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {!loading && `${products.length} products total`}
            </p>
          </div>
          <Link
            to="/admin/create-product"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 active:scale-95 transition-all duration-150"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl p-10 text-center text-sm text-gray-500">
            Loading products...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-white rounded-2xl p-10 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center text-sm text-gray-500">
            Koi product nahi mila. Pehla product add karo.
          </div>
        )}

        {/* ── Desktop: Table ── */}
        {!loading && !error && products.length > 0 && (
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Stock</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            product.images?.[0]?.url ||
                            "https://placehold.co/100x100?text=No+Image"
                          }
                          alt={product.name}
                          className="w-11 h-11 rounded-lg object-cover bg-gray-100"
                        />
                        <span className="font-medium text-gray-900 line-clamp-1">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      ₹{product.price?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          product.stock > 0 ?
                            "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-500"
                        }`}
                      >
                        {product.stock > 0 ?
                          `${product.stock} in stock`
                        : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/edit-product/${product._id}`}
                          className="p-2 rounded-lg text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(product._id, product.name)
                          }
                          disabled={deletingId === product._id}
                          className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Mobile: Cards ── */}
        {!loading && !error && products.length > 0 && (
          <div className="md:hidden space-y-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-sm p-4"
              >
                <div className="flex gap-3">
                  <img
                    src={
                      product.images?.[0]?.url ||
                      "https://placehold.co/100x100?text=No+Image"
                    }
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      ₹{product.price?.toLocaleString()}
                    </p>
                    <span
                      className={`inline-block mt-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        product.stock > 0 ?
                          "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                      }`}
                    >
                      {product.stock > 0 ?
                        `${product.stock} in stock`
                      : "Out of stock"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Link
                    to={`/admin/edit-product/${product._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    <Pencil size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id, product.name)}
                    disabled={deletingId === product._id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    {deletingId === product._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductList;
