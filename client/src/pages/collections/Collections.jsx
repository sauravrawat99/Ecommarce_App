import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollectionCard from "./collectionCard";
import { getAllCollection } from "../../redux/slices/collectionsSlice";

const Collections = () => {
  const dispatch = useDispatch();
  const { collections, loading, error } = useSelector(
    (state) => state.collection,
  );

  console.log(collections);

  useEffect(() => {
    dispatch(getAllCollection());
  }, [dispatch]);

  if (loading) return <div>Loading collections...</div>;
  if (error) return <div>Something went wrong: {error}</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-16 py-8">
      {collections.map((collection) => (
        <CollectionCard key={collection.slug} collection={collection} />
      ))}
    </div>
  );
};

export default Collections;
