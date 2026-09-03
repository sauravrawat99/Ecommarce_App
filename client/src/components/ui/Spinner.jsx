const Spinner = ({ size = "md", color = "indigo" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-4",
  };

  // Same key names as before (indigo/white/gray) — retinted to the
  // Feacherd palette so every loading state matches the rest of the app
  const colorClasses = {
    indigo: "border-[#FF5A1F] border-t-transparent", // accent
    white: "border-white border-t-transparent",
    gray: "border-[#5B6472] border-t-transparent", // slate
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default Spinner;
