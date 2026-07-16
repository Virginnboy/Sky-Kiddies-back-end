require("dotenv").config();

const globalErrorHandler = (err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(el => el.message).join(". ");
    console.log(message);

    err.status = "fail";
    err.statusCode = 400;
    err.message = message;
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