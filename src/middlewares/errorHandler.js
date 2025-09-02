import { StatusCodes } from "http-status-codes";
import Jwt from "jsonwebtoken";
import AppError  from "../Errors/appError.js";

export const errorHandler = (err, req, res, next) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || "Internal Server Error";
  let details = err.message;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation failed";
    details = err.errors.map((error) => ({
      field: error.path.join("."),
      message: error.message,
    }));
  } else if (err instanceof Jwt.JsonWebTokenError) {
    statusCode = 401;
    message = "Invalid token";
  } else if (err instanceof Jwt.TokenExpiredError) {
    statusCode = 401;
    message = "Token expired";
  } else if (err.type === "entity.too.large") {
    statusCode = 413;
    message = "The uploaded image is too large. Please upload a smaller image.";
    details = "Max request size exceeded. Limit is 10MB.";
  }

  const response = {
    success: false,
    error: {
      code: statusCode,
      message,
      details,
    },
  };

  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] ${err.stack || err}`);
    console.log(response);
  }

  res.status(statusCode).json(response);
};
