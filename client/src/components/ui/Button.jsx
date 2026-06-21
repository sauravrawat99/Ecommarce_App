const Button = ({
  children,
  onClick,
  type = "button", // ✅ default value
  disabled = false, // ✅ default value
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-blue-300 
        text-white 
        px-6 py-3 
        rounded-full 
        text-sm 
        font-medium 
        hover:bg-blue-600 
        transition-all 
        duration-300
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
