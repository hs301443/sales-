import { verifyToken } from "../utils/auth.js";
import { UnauthorizedError } from "../Errors/unauthorizedError.js";

export function authenticated(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Invalid Token");
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  // نحفظ البيانات في req.user
  req.user = decoded;
  next();
}