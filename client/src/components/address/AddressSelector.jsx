import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserAddresses,
  setDefaultAddress,
  deleteAddress,
  clearAddressError,
} from "../../redux/slices/addressSlice"; // path confirm kar lena
import AddressCard from "./AddressCard";
import AddressFormModal from "./AddressFormModal";

const AddressSelector = ({ selectedAddressId, onSelect }) => {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);

  const [showModal, setShowModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  // 1. Mount pe addresses fetch karo
  useEffect(() => {
    dispatch(getUserAddresses());
    return () => {
      dispatch(clearAddressError());
    };
  }, [dispatch]);

  // 2. Auto-select: default address, warna pehla. Selected delete ho gaya toh bhi re-select
  useEffect(() => {
    if (addresses.length === 0) {
      if (selectedAddressId) onSelect(null);
      return;
    }

    const stillExists = addresses.some((a) => a._id === selectedAddressId);
    if (!selectedAddressId || !stillExists) {
      const fallback = addresses.find((a) => a.isDefault) || addresses[0];
      onSelect(fallback._id);
    }
  }, [addresses, selectedAddressId, onSelect]);

  const handleAddNew = () => {
    setEditAddress(null);
    setShowModal(true);
  };

  const handleEdit = (address) => {
    setEditAddress(address);
    setShowModal(true);
  };

  const handleDelete = (addressId) => {
    if (!window.confirm("Kya tum is address ko delete karna chahte ho?"))
      return;
    dispatch(deleteAddress(addressId));
  };

  const handleSetDefault = (addressId) => {
    dispatch(setDefaultAddress(addressId));
  };

  const closeModal = () => {
    setShowModal(false);
    setEditAddress(null);
  };

  return (
    <div className="address-selector">
      <h3>Select Delivery Address</h3>

      {loading && addresses.length === 0 && <p>Loading addresses...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && addresses.length === 0 && (
        <p>Koi saved address nahi hai. Pehle ek address add karo.</p>
      )}

      {addresses.map((addr) => (
        <AddressCard
          key={addr._id}
          address={addr}
          isSelected={selectedAddressId === addr._id}
          onSelect={onSelect}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSetDefault={handleSetDefault}
        />
      ))}

      <button type="button" className="add-address-btn" onClick={handleAddNew}>
        + Add New Address
      </button>

      {showModal && (
        <AddressFormModal
          existingAddress={editAddress}
          onClose={closeModal}
          onSuccess={closeModal}
        />
      )}
    </div>
  );
};

export default AddressSelector;
