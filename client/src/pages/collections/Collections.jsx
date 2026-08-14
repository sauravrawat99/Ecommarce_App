import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollectionCard from "./collectionCard";
import { fetchAllCollections } from "../../redux/slices/collectionsSlice";

const Collections = () => {
  const dispatch = useDispatch();
  // 👈 "collection" slice name se match karna zaroori hai (jo createSlice mein diya tha),
  // aur property lowercase "collections" honi chahiye (jo initialState mein defined hai)
  const { collections, loading, error } = useSelector(
    (state) => state.collection,
  );

  useEffect(() => {
    dispatch(fetchAllCollections());
  }, [dispatch]);

  if (loading) return <div>Loading collections...</div>;
  if (error) return <div>Something went wrong: {error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <CollectionCard key={collection._id} collection={collection} />
      ))}
    </div>
  );
};

export default Collections;
