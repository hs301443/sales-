import AppError from "./appError.js";
import { StatusCodes } from "http-status-codes";

export class ForeignKeyConstrainError extends AppError {
  constructor(field, details) {
    super(
      `Invalid reference for field ${field}`,
      StatusCodes.BAD_REQUEST,
      details
    );
  }
}