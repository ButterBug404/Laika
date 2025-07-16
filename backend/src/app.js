//External packages
import express from 'express'
import * as tf from '@tensorflow/tfjs-node';
import path from 'path';
import { fileURLToPath } from 'url';
//Local packages
import { authRouter } from '../routes/auth.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
app.use(express.json({ limit: '10mb'}));

async function loadModel() {
	const modelPath = path.join(__dirname, '../model', 'model.json');
	let model = await tf.loadLayersModel(`file://${modelPath}`);
}
loadModel();

app.use('/api', authRouter);
