import Joi from "joi";

// 🗂️ تجميع كل الملفات اللي اتبعتت في request
function gatherFiles(req) {
  const files = [];
  if (req.file) files.push(req.file);
  if (req.files) {
    if (Array.isArray(req.files)) {
      files.push(...req.files);
    } else {
      Object.values(req.files)
        .flat()
        .forEach((file) => {
          files.push(file);
        });
    }
  }
  return files;
}

// ✅ Middleware التحقق من البيانات
export const validate = (schema, target = "body") => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req[target], { abortEarly: false });
      next();
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 400,
            message: error.message,
            details: error.details.map((d) => d.message),
          },
        });
      }
      next(error);
    }
  };
};
