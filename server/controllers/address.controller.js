const ApiError = require("../utils/ApiError");
const AsyncHandler = require("../utils/AsyncHandle");
const {
  createAddress,
  getUserAddresses,
  setDefaultAddress,
  deleteAddress,
  updateAddress,
} = require("../service/address.service");

exports.createAddress = AsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const addressData = req.body;

  const newAddress = await createAddress(userId, addressData);

  res.status(201).json({
    success: true,
    message: "Address created successfully",
    newAddress,
  });
});

exports.getUserAddresses = AsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const addresses = await getUserAddresses(userId);

  res.status(200).json({
    success: true,
    message: "Addresses fetched successfully",
    count: addresses.length,
    addresses,
  });
});

exports.setDefaultAddress = AsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const updatedAddress = await setDefaultAddress(userId, id);

  res.status(200).json({
    success: true,
    message: "Default address updated",
    updatedAddress,
  });
});

exports.deleteAddress = AsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  await deleteAddress(userId, id);

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});

exports.updatedAddress = AsyncHandler(async (req, res) => {
  const { id: addressId } = req.params;
  const userId = req.user._id;
  const updatedData = req.body;

  const address = await updateAddress(addressId, userId, updatedData);

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    data: address,
  });
});
