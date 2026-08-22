import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getAllCollection,
  deleteCollection,
} from "../../redux/slices/collectionsSlice";

const CollectionsList = () => {
  const dispatch = useDispatch();
  const { collections, loading, error } = useSelector(
    (state) => state.collection,
  );

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    dispatch(getAllCollection());
  }, [dispatch]);

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    dispatch(deleteCollection(confirmDeleteId));
    setConfirmDeleteId(null);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Collections</h2>
        <Link
          to="/admin/collection/create"
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium"
        >
          + Create Collection
        </Link>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 p-2 rounded mb-4">
          {error}
        </p>
      )}

      {loading && <p className="text-sm text-gray-500">Loading...</p>}

      {!loading && collections?.length === 0 && (
        <p className="text-sm text-gray-500">No collections found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collections?.map((col) => (
          <div
            key={col._id}
            className="border border-gray-200 rounded-xl p-4 flex flex-col gap-2"
          >
            {col.image?.url ?
              <img
                src={col.image.url}
                alt={col.name}
                className="w-full h-32 object-cover rounded-lg"
              />
            : <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                No image
              </div>
            }

            <div className="flex items-center justify-between">
              <p className="font-medium">{col.name}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  col.type === "manual" ?
                    "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
                }`}
              >
                {col.type}
              </span>
            </div>

            <p className="text-xs text-gray-500 line-clamp-2">
              {col.description || "No description"}
            </p>

            <div className="flex items-center justify-between mt-2">
              <span
                className={`text-xs ${
                  col.isActive ? "text-green-600" : "text-gray-400"
                }`}
              >
                {col.isActive ? "Active" : "Inactive"}
              </span>

              <div className="flex gap-2">
                <Link
                  to={`/admin/collection/${col._id}/edit`}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteClick(col._id)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Delete confirm modal ─── */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <p className="text-sm font-medium mb-4">
              Ye collection delete karna hai? Ye action wapas nahi ho sakta.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsList;
