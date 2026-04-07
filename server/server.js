// server.js

const express = require("express");
const { Dbconnect, PORT } = require("./config/Db");
const authRoutes = require("./routes/authRoutes");
const ErrorMiddleware = require("./utils/ErrorMiddleware");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

// app init
const app = express();

// sets around 14 security headers to protest against common vulnerabilities
app.use(helmet());

// middleware ==> functions that have access to the request and response objects
//  and can modify them or perform actions before passing control to the next
//  middleware or route handler. They are used for tasks like logging,
//  authentication, error handling, etc.
app.use(morgan("dev"));

// Middleware to enable Cross-Origin Resource Sharing (CORS) and allow requests
//  from different origins
app.use(cors());

// Middleware to parse incoming JSON payloads and make them available in req.body
app.use(express.json());

// middleware to handle routes related to authentication, such as login and registration
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

Dbconnect();

// Middleware to handle errors that occur during request processing and send appropriate
app.use(ErrorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
