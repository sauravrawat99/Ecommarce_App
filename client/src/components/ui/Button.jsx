// src/components/ui/Button.jsx
import Spinner from "./Spinner";

const VARIANT_STYLES = {
  primary:
    "bg-[#FF5A1F] text-white hover:bg-[#FF5A1F]/90 disabled:bg-[#FF5A1F]/50",
  secondary:
    "bg-[#14161A] text-white hover:bg-[#14161A]/90 disabled:bg-[#14161A]/40",
  outline:
    "bg-transparent text-[#14161A] border border-[#14161A]/20 hover:bg-[#14161A]/5 disabled:text-[#5B6472]/50 disabled:border-[#14161A]/10",
  ghost:
    "bg-transparent text-[#14161A] hover:bg-[#14161A]/5 disabled:text-[#5B6472]/50",
  danger:
    "bg-[#E5484D] text-white hover:bg-[#E5484D]/90 disabled:bg-[#E5484D]/50",
};

const SIZE_STYLES = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

const SPINNER_COLOR = {
  primary: "white",
  secondary: "white",
  outline: "black",
  ghost: "black",
  danger: "white",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon = null, // optional icon element, e.g. <Heart size={16} />
  type = "button",
  className = "",
  onClick,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        rounded-[3px] font-medium
        transition-colors duration-200
        disabled:cursor-not-allowed
        ${VARIANT_STYLES[variant]}
        ${SIZE_STYLES[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...rest}
    >
      {loading ?
        <Spinner size="sm" color={SPINNER_COLOR[variant]} />
      : <>
          {icon}
          {children}
        </>
      }
    </button>
  );
};

export default Button;
