import { Link } from "react-router-dom";

const FALLBACK_IMAGE = "https://placehold.co/600x400?text=Collection";

const CollectionCard = ({ collection }) => {
  return (
    <Link to={`/collections/${collection.slug}`}>
      <div className="bg-gray-300">
        <img
          src={collection.image?.url || FALLBACK_IMAGE}
          alt={collection.name}
        />
        <p>{collection.name}</p>
      </div>
    </Link>
  );
};

export default CollectionCard;
