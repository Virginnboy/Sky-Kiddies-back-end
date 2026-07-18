require("dotenv").config();

const globalErrorHandler = (err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // VALIDATION ERROR
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(el => el.message).join(". ");
    console.log(message);

    err.status = "fail";
    err.statusCode = 400;
    err.message = message;
  }

  // TOKEN ERRORS
  // 1) Token expired error
  if (err.name === "TokenEpiredError") {
    err.statusCode = 401;
    err.status = "fail";
    err.message = "Token expired. Please login again.";
  }

  // 2)Json WebToken Error
  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.status = "fail";
    err.message = "Invalid token. Please log in again."
  }

  if (process.env.NODE_ENV === "production" && !err.isOperational) {
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong"
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};

module.exports = globalErrorHandler;