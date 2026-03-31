class ApiError extends Error {
  constructor(message, statusCode) {
    super(message); // parent Error class ko call

    this.statusCode = statusCode;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
