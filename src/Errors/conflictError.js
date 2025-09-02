import AppError from "./appError.js";
import { StatusCodes } from "http-status-codes";

export class ConflictError extends AppError {
  constructor(message = "Resource Conflict", details) {
    super(message, StatusCodes.CONFLICT, details);
  }
}