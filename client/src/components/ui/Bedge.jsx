const Bedge = ({ children, variant = "amber", size = "sm" }) => {
  // Same variant keys as before (amber/indigo/success/danger/outline) —
  // sirf color values ab Feacherd palette follow karte hain
  const variantClasses = {
    amber: "bg-[#FF5A1F] text-white", // accent
    indigo: "bg-[#14161A] text-white", // ink
    success: "bg-emerald-600 text-white",
    danger: "bg-[#E5484D] text-white",
    outline: "bg-white text-[#14161A] border border-[#14161A]/20",
  };

  const sizeClasses = {
    sm: "text-[10px] font-bold w-5 h-5",
    md: "text-xs font-bold px-2.5 py-1 tracking-wide uppercase",
  };

  // Signature shape: square everywhere, no circles/pills — matches the
  // accent-square motif used in Navbar/Footer
  const shapeClass =
    size === "sm" ?
      "rounded-[3px] flex items-center justify-center"
    : "rounded-[3px]";

  return (
    <span
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${shapeClass} font-semibold inline-block`}
    >
      {children}
    </span>
  );
};

export default Bedge;
