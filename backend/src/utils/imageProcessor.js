import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const processImage = async (tempPath, newPath, resizeOptions) => {
  try {
    await sharp(tempPath)
      .resize(resizeOptions.width, resizeOptions.height, { fit: resizeOptions.fit || 'cover' })
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

export const processProfileImage = async (tempPath, userId) => {
  const profilePictureDir = path.join(__dirname, '../../pictures/profile');
  const newFileName = `${userId}.webp`;
  const newPath = path.join(profilePictureDir, newFileName);
  return processImage(tempPath, newPath, { width: 500, height: 500 });
};

export const processPetImage = async (tempPath, petId, imageNumber, isFaceImage = false) => {
  const petsPictureDir = path.join(__dirname, '../../pictures/pets');
  const subDir = isFaceImage ? 'faces' : 'body';
  const dir = path.join(petsPictureDir, subDir);

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }

  const newFileName = isFaceImage ? `${petId}.webp` : `${petId}_${imageNumber}.webp`;
  const newPath = path.join(dir, newFileName);
  
  const resizeOptions = isFaceImage 
    ? { width: 500, height: 500 } 
    : { width: 800, height: 600, fit: 'inside' };

  return processImage(tempPath, newPath, resizeOptions);
};

