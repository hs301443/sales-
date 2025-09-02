import AppError from "./appError.js";
import { StatusCodes } from "http-status-codes";

export class BadRequest extends AppError {
  constructor(message = "Bad request", details) {
    super(message, StatusCodes.BAD_REQUEST, details);
  }
}