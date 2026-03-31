const errHandle = (err, req, res, next) => {
  if (err) {
    console.log(err);
  }
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
};
