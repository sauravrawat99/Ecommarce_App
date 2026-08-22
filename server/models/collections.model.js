const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: String,
    image: {
      public_id: String,
      url: String,
    },
    type: {
      type: String,
      enum: ["manual", "smart"],
      default: "smart",
    },

    // Manual collection ke liye — admin ne khud jo products chune
    products: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],

    // Smart collection ke liye — rules jo automatically match karenge

    rules: {
      category: { type: mongoose.Schema.ObjectId, ref: "Category" },
      categoryIn: [{ type: mongoose.Schema.ObjectId, ref: "Category" }], // 👈 naya
      brand: String,
      gender: { type: String, enum: ["men", "women", "unisex"] },
      minPrice: Number,
      maxPrice: Number,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);
collectionSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  // next(); // 👈 ye line add karo
});
module.exports = mongoose.model("Collection", collectionSchema);
