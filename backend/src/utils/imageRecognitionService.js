import * as tf from '@tensorflow/tfjs-node';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

let model;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadRecognitionModel() {
  if (model) {
    return model;
  }
  try {
    const modelPath = 'file://' + path.resolve(__dirname, '..', '..', 'model', 'fase_rostro', 'model.json');
    model = await tf.loadGraphModel(modelPath);
    console.log('Image Recognition Model loaded');
    return model;
  } catch (error) {
    console.error('Error loading image recognition model:', error.message);
    throw error;
  }
}

async function preprocessImage(imagePath) {
  const buffer = await sharp(imagePath)
    .resize(224, 224)
    .raw()
    .toBuffer();

  const imgTensor = tf.tensor3d(
    new Float32Array(buffer),
    [224, 224, 3]
  );
  
  return imgTensor.div(255.0).expandDims(0);
}

export async function compareImages(imagePath1, imagePath2) {
  if (!model) {
    await loadRecognitionModel();
  }

  try {
    const img1 = await preprocessImage(imagePath1);
    const img2 = await preprocessImage(imagePath2);

    const embedding1 = model.predict(img1);
    const embedding2 = model.predict(img2);

    const similarity = tf.sum(tf.mul(embedding1, embedding2));
    const simValue = (await similarity.array())[0];

    img1.dispose();
    img2.dispose();
    embedding1.dispose();
    embedding2.dispose();
    similarity.dispose();

    return simValue;
  } catch (error) {
    console.error('Error comparing images:', error.message);
    throw error;
  }
}
