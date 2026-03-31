// server.js

const express = require("express");
const { Dbconnect, PORT } = require("./config/Db");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");

// config env
// dotenv.config();

// app init
const app = express();

// middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

Dbconnect()

// DB connect
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("MongoDB Connected ✅"))
//   .catch((err) => console.log(err));

// // server start
// const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
