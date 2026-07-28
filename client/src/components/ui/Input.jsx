const Input = ({ label, type, name, value, onChange, placeholder, error, icon: Icon }) => {
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
          className={`w-full py-3 pr-4 ${Icon ? "pl-10" : "pl-4"} rounded-xl border text-sm
                     transition-colors duration-150
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     ${error ? "border-red-400" : "border-gray-200"}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;