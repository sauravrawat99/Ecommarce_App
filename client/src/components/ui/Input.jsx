const Input = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
}) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
