// server.js

const express = require("express");
const { Dbconnect, PORT } = require("./config/Db");
const authRoutes = require("./routes/authRoutes");
const ErrorMiddleware = require("./utils/ErrorMiddleware");

// app init
const app = express();

// middleware
app.use(express.json());
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

Dbconnect();

//Error handler
app.use(ErrorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
