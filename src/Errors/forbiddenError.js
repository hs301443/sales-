import AppError from "./appError.js";
import { StatusCodes } from "http-status-codes";

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden Resource", details) {
    super(message, StatusCodes.FORBIDDEN, details);
  }
}