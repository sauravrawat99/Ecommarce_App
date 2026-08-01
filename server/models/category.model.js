const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    parent: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  { timestamps: true },
);

// Same name allowed under different parents, but not under the same parent twice
categorySchema.index({ name: 1, parent: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
