const AsyncHandler = require("../utils/AsyncError");
const Product = require("../models/model.Product");

exports.FindProducts = AsyncHandler(async () => {
  await Product.find();
  res.json({
    success: true,
    token,
    Product: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});
