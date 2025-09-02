import fs from "fs/promises";
import path from "path";

/**
 * Delete a photo from server by relative path
 * @param relativePath Path relative to project root (e.g., "uploads/images/photo.jpg")
 * @returns true if deleted, false if not found
 */
export const deletePhotoFromServer = async (
  relativePath
) => {
  try {
    // ✅ نخلي الـ path دايمًا مربوط بالـ project root
    const filePath = path.resolve(process.cwd(), relativePath);

    // ✅ نتأكد إن الملف موجود
    await fs.access(filePath).catch(() => {
      return false;
    });

    // ✅ نحذف الملف
    await fs.unlink(filePath);
    return true;
  } catch (err) {
    console.error("Error deleting photo:", err);
    throw new Error("Failed to delete photo from server");
  }
};
