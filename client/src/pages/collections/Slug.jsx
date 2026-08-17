import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBySlug } from "../../redux/slices/collectionsSlice";
import SlugCard from "./SlugCard";
import { useParams } from "react-router-dom";

export const Slug = () => {
  const dispatch = useDispatch();
  const { loading, error, products, collection, pagination } = useSelector(
    (state) => state.collection,
  );

  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      dispatch(getBySlug(slug));
    }
  }, [dispatch, slug]); // ✅ fixed — slug dependency mein add kiya

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) return <div>Something went wrong: {error}</div>;

  return (
    <>
      <h1>{pagination.totalCount}</h1> {/* ✅ fixed */}
      <div>
        <img src={collection.image?.url} alt={collection.name} />
      </div>
      <div>
        {products.map((prod) => (
          <SlugCard key={prod._id} props={prod} /> // ✅ fixed — return + _id
        ))}
      </div>
    </>
  );
};
 