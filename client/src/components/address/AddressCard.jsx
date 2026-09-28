const AddressCard = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  return (
    <div className={`address-card ${isSelected ? "selected" : ""}`}>
      <label className="address-card-label">
        <input
          type="radio"
          name="deliveryAddress"
          checked={isSelected}
          onChange={() => onSelect(address._id)}
        />

        <div className="address-card-info">
          <div className="address-card-header">
            <strong>{address.fullName}</strong>
            <span className="badge type-badge">{address.type}</span>
            {address.isDefault && (
              <span className="badge default-badge">Default</span>
            )}
          </div>

          <p>
            {address.address}, {address.city}, {address.state} -{" "}
            {address.pincode}
          </p>
          <p>Phone: {address.phone}</p>
        </div>
      </label>

      <div className="address-card-actions">
        {!address.isDefault && (
          <button type="button" onClick={() => onSetDefault(address._id)}>
            Set Default
          </button>
        )}
        <button type="button" onClick={() => onEdit(address)}>
          Edit
        </button>
        <button type="button" onClick={() => onDelete(address._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
