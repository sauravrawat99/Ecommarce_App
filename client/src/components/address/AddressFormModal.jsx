import { useState } from "react";
import { useDispatch } from "react-redux";
import { createAddress, updateAddress } from "../../redux/slices/addressSlice"; // path confirm kar lena

const AddressFormModal = ({ existingAddress, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const isEdit = Boolean(existingAddress);

  const [form, setForm] = useState({
    fullName: existingAddress?.fullName || "",
    phone: existingAddress?.phone || "",
    address: existingAddress?.address || "",
    city: existingAddress?.city || "",
    state: existingAddress?.state || "",
    pincode: existingAddress?.pincode || "",
    type: existingAddress?.type || "home",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!/^\d{10}$/.test(form.phone))
      return "Phone number 10 digit ka hona chahiye";
    if (!/^\d{6}$/.test(form.pincode)) return "Pincode 6 digit ka hona chahiye";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      if (isEdit) {
        await dispatch(
          updateAddress({ addressId: existingAddress._id, updateData: form }),
        ).unwrap();
      } else {
        await dispatch(createAddress(form)).unwrap();
      }
      onSuccess();
    } catch (err) {
      // rejectWithValue ka payload (string) yahan aata hai
      setError(typeof err === "string" ? err : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isEdit ? "Edit Address" : "Add New Address"}</h3>

        <form onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone (10 digit)"
            value={form.phone}
            onChange={handleChange}
            maxLength={10}
            required
          />
          <input
            name="address"
            placeholder="House no, Street, Area"
            value={form.address}
            onChange={handleChange}
            required
          />
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
          />
          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            required
          />
          <input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            maxLength={6}
            required
          />

          <select name="type" value={form.type} onChange={handleChange}>
            <option value="home">Home</option>
            <option value="office">Office</option>
            <option value="other">Other</option>
          </select>

          {error && <p className="error">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ?
                "Saving..."
              : isEdit ?
                "Update"
              : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressFormModal;
