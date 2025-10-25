import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const processProfileImage = async (tempPath, userId) => {
  const profilePictureDir = path.join(__dirname, '../../pictures/profile');
  const newFileName = `${userId}.webp`;
  const newPath = path.join(profilePictureDir, newFileName);

  try {
    await sharp(tempPath)
      .resize(500, 500, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(newPath);

    fs.unlink(tempPath, (err) => {
      if (err) console.error("Error deleting temporary file:", err);
    });

    return newPath;

  } catch (sharpErr) {
    console.error("Error processing image with sharp:", sharpErr);
    fs.unlink(tempPath, (err) => {
      if (err) console.error("Error deleting temporary file after failed processing:", err);
    });
    throw sharpErr;
  }
};
