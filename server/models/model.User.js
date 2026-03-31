const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [5, "Minimum length should be 5"],
      maxlength: [100, "Maximum length should be 100"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Minimum length should be 8"],
      maxlength: [15, "Maximum length should be 15"],
    },

    address: {
      city: {
        type: String,
        required: true,
      },
      state: String,
      pincode: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
