import { ApiError } from "../utils/ApiError.js";

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  // console.log(err.message);
  err.statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`,
      err = new ApiError(400, message);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again!`;
    err = new ApiError(400, message);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    err = new ApiError(400, message);
  }
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`,
      err = new ApiError(400, message);
  }

  let errorMessage;

  if (err.errors && err.errors.length !== 0) {
    // If specific errors exist
    errorMessage = Object.values(err.errors).map((error) => error.message);
  } else {
    // If there are no specific errors
    errorMessage = [err.message];
  }
  console.log(errorMessage);

  return res.status(err.statusCode).json({
    success: false,
    // message: err.message,
    message: errorMessage,
  });
};
