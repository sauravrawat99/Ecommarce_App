const SlugCard = ({ props }) => {
  return (
    <div>
      <img src={props.images[0]?.url} alt={props.name} />
      <h1>{props.name}</h1>
      <h1>{props.description}</h1>
      <h1>₹{props.price}</h1>
      <ul>
        {props.variants.map((variant) => (
          <li key={variant._id}>{variant.color}</li>
        ))}
      </ul>
    </div>
  );
};

export default SlugCard;