import { Link } from "react-router-dom";

const FALLBACK_IMAGE = "https://placehold.co/400x350?text=Collection";

const CollectionCard = ({ collection }) => {
  return (
    <Link to={`/collections/${collection.slug}`} className="group block">
      <div className="bg-gray-100 w-full aspect-[3/4] overflow-hidden">
        <img
          src={collection.image?.url || FALLBACK_IMAGE}
          alt={collection.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <p className="mt-3 text-base text-gray-800">{collection.name}</p>
    </Link>
  );
};

export default CollectionCard;
