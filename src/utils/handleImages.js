import path from "path";
import fs from "fs/promises";
import { Request } from "express";

/**
 * Save base64 image to server
 * @param base64 Base64 string (with MIME type)
 * @param userId Unique identifier for file naming
 * @param req Express request (to build full URL)
 * @param folder Target folder inside /uploads
 * @returns Full URL to the saved image
 */
export async function saveBase64Image(
  base64,
  userId,
  req,
  folder
) {
  const matches = base64.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 format");
  }

  const mimeType = matches[1];
  const ext = mimeType.split("/")[1]?.toLowerCase();

  // ✅ نتحقق من الامتداد المسموح بيه
  const allowedExts = ["png", "jpg", "jpeg", "gif", "webp"];
  if (!ext || !allowedExts.includes(ext)) {
    throw new Error("Unsupported image type");
  }

  const buffer = Buffer.from(matches[2], "base64");

  // ✅ نخلي اسم الصورة unique مش بس userId (عشان ما يتكتبش فوق الصور القديمة)
  const fileName = `${userId}-${Date.now()}.${ext}`;
  const uploadsDir = path.resolve(process.cwd(), "uploads", folder);

  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (err) {
    console.error("Failed to create directory:", err);
    throw new Error("Could not create uploads directory");
  }

  const filePath = path.join(uploadsDir, fileName);

  try {
    await fs.writeFile(filePath, buffer);
  } catch (err) {
    console.error("Failed to write image file:", err);
    throw new Error("Could not save image file");
  }

  // ✅ نستخدم req.originalUrl لو عايزين نبني URL ديناميكي
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${folder}/${fileName}`;
  return imageUrl;
}
