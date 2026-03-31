const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Dbconnect = async function () {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connect db");
  } catch (error) {
    console.log(error);
  }
};
const PORT = process.env.PORT || 5000;

module.exports = { Dbconnect, PORT };
