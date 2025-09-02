import AppError from "./appError.js";
import { StatusCodes } from "http-status-codes";

export class ValidationError extends AppError {
  constructor(message, details) {
    super(message, StatusCodes.BAD_REQUEST, details);
  }
}