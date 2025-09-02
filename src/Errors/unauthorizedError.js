import AppError from "./appError.js";
import { StatusCodes } from "http-status-codes";

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized Access", details) {
    super(message, StatusCodes.UNAUTHORIZED, details);
  }
}
