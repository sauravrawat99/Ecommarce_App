const Address = require("../models/address.model");
const ApiError = require("../utils/ApiError");

// Naya address create karo
exports.createAddress = async (userId, addressData) => {
  const newAddress = await Address.create({
    user: userId,
    ...addressData,
  });
  return newAddress;
};

// Logged-in user ke saare addresses laao
exports.getUserAddresses = async (userId) => {
  const addresses = await Address.find({ user: userId }).sort({
    createdAt: -1,
  });
  return addresses;
};

// Ek address ko default banao
exports.setDefaultAddress = async (userId, addressId) => {
  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) {
    throw new ApiError("Address not found", 404);
  }

  // Pehle user ke saare addresses ka isDefault false karo
  await Address.updateMany({ user: userId }, { isDefault: false });

  // Fir ye wala address default banao
  address.isDefault = true;
  await address.save();

  return address;
};

// Address delete karo
exports.deleteAddress = async (userId, addressId) => {
  const address = await Address.findOneAndDelete({
    _id: addressId,
    user: userId,
  });
  if (!address) {
    throw new ApiError("Address not found", 404);
  }
  return address;
};
