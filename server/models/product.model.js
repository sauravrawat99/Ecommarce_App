const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      minlength: [3, "Minimum length should be 3"],
      maxlength: [100, "Maximum length should be 100"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    description: {
      type: String,
      maxlength: [1000, "Description too long"],
    },

    category: {
      type: String,
      required: true,
      enum: ["electronics", "clothing", "food", "books"],
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    images: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    brand: {
      type: String,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
