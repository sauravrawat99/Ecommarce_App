const Input = ({ label, type, name, value, onChange, placeholder }) => {
  return (
    <div>
      <label className="text-sm font-medium text-[#1d1d1f] mb-1 block">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-200
                   focus:outline-none focus:border-blue-500 text-sm"
      />
    </div>
  );
};

export default Input;
