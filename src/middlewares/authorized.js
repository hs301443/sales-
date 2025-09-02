// import { NextFunction, Request, Response, RequestHandler } from "express";
// import { UnauthorizedError } from "../Errors/unauthorizedError";
// import { AppUser } from "../types/custom"; // نوع المستخدم

// // خلي الـ Request user اختياري
// export interface AuthenticatedRequest extends Request {
//   user?: AppUser;
// }

// export const authorizeRoles = (...roles: string[]): RequestHandler => {
//   return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       return next(new UnauthorizedError()); // لو مش موجود user
//     }

//     if (!roles.includes(req.user.role)) {
//       return next(new UnauthorizedError()); // لو الدور مش متوافق
//     }

//     next();
//   };
// };

import { UnauthorizedError } from "../Errors/unauthorizedError.js";
import { AdminModel } from "../models/shema/auth/Admin.js";
import jwt from "jsonwebtoken";

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError("User not authenticated"));
    }

    // ✅ Super Admin يدخل من غير شروط
    if (req.user.isSuperAdmin) {
      return next();
    }

    // ✅ لو مفيش role أو الرول مش ضمن المسموح
    if (!req.user.role || !roles.includes(req.user.role)) {
      return next(new UnauthorizedError("You don't have permission"));
    }

    next();
  };
};

// 🔑 التحقق من الصلاحيات
export const authorizePermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError("User not authenticated"));
    }

    if (req.user.isSuperAdmin) {
      return next();
    }

    const userPermissions = new Set([
      ...(req.user.rolePermissions || []),
      ...(req.user.customPermissions || []),
    ]);

    // ✅ لازم المستخدم يكون عنده كل البرميشنز المطلوبة
    const missingPerms = permissions.filter((perm) => !userPermissions.has(perm));
    if (missingPerms.length > 0) {
      return next(
        new UnauthorizedError(`Missing permissions: ${missingPerms.join(", ")}`)
      );
    }

    next();
  };
};

// 🔑 التحقق من التوكن وتعبئة req.user
export const auth = async (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    if (!token) return next(new UnauthorizedError("No token provided"));

    // ✅ التأكد من صحة التوكن واستخراج البيانات
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ البحث عن السوبر أدمن أو أي أدمن حسب الـ _id
    const admin = await AdminModel.findById(payload.sub).populate("role");
    if (!admin) return next(new UnauthorizedError("Admin not found"));

    // ✅ ملء معلومات المستخدم في req.user
    req.user = {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role?.name || null, // null لو مفيش role
      isSuperAdmin: admin.isSuperAdmin,
      customPermissions: admin.customPermissions || [],
      rolePermissions: admin.role?.permissions || [],
    };

    next();
  } catch (err) {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};
