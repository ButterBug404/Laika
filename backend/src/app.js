//External packages
import express from 'express'
import * as tf from '@tensorflow/tfjs';
import path from 'path';
import { fileURLToPath } from 'url';
//Local packages
import { authRouter } from './routes/auth.routes.js';
import { petsRouter } from './routes/pets.routes.js';
import { adoptionRouter } from './routes/adoption.routes.js';
import { missingRouter }  from './routes/missing.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
app.use(express.json({ limit: '10mb'}));

//async function loadModel() {
//	const modelPath = path.join(__dirname, '../model', 'model.json');
//	let model = await tf.loadLayersModel(`file://${modelPath}`);
//}
//loadModel();

app.use('/api', authRouter);
app.use('/api', petsRouter);
app.use('/api', adoptionRouter);
app.use('/api', missingRouter);
