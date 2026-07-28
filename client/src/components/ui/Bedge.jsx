const Bedge = ({ children, variant = "amber", size = "sm" }) => {
  const variantClasses = {
    amber: "bg-amber-500 text-white",
    indigo: "bg-indigo-600 text-white",
    success: "bg-emerald-500 text-white",
    danger: "bg-red-500 text-white",
    outline: "bg-white text-gray-700 border border-gray-300",
  };

  const sizeClasses = {
    sm: "text-xs w-5 h-5",
    md: "text-sm px-2.5 py-0.5",
  };

  // Small circular badge (cart/wishlist count) vs pill badge (sale/status tags)
  const shapeClass =
    size === "sm" ?
      "rounded-full flex items-center justify-center"
    : "rounded-md";

  return (
    <span
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${shapeClass} font-semibold inline-block`}
    >
      {children}
    </span>
  );
};

export default Bedge;
