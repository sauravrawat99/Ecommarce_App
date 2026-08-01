const ApiError = require("../utils/ApiError");
const AsyncHandler = require("../utils/AsyncHandle");
const {
  createAddress,
  getUserAddresses,
  setDefaultAddress,
  deleteAddress,
} = require("../service/address.service");

// @desc Naya address create karo
// @route POST /api/addresses
// @access Private
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

// @desc Logged-in user ke saare addresses laao
// @route GET /api/addresses
// @access Private
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

// @desc Ek address ko default banao
// @route PUT /api/addresses/:id/set-default
// @access Private
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

// @desc Address delete karo
// @route DELETE /api/addresses/:id
// @access Private
exports.deleteAddress = AsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  await deleteAddress(userId, id);

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});
