const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary", // ✅ naya prop — flexibility ke liye
  className = "",
}) => {
  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400",
    outline:
      "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 focus-visible:ring-indigo-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        px-6 py-3
        rounded-full
        text-sm
        font-medium
        transition-all
        duration-200
        active:scale-95
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-offset-2
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:active:scale-100
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
