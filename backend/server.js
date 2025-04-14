import * as tf from '@tensorflow/tfjs-node'
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb'}));

let model;
async function loadModel() {
	const modelPath = path.join(__dirname, 'model', 'model.json');
	model = await tf.loadLayersModel(`file://${modelPath}`);
}
loadModel();

app.post('/predict', async (req, res) => {
	try{
		const data = req.body.data;
		const inputTensor = tf.tensor(data);
		const prediction = model.predict(inputTensor);
		const result = Array.from(prediction.dataSync());
		res.json({ prediction: result});
	}catch(err){
		res.status(500).json({error: err.message, line: err.line})
	}
});

const PORT = 3001;
app.listen(PORT, async () => {
	console.log(`Servidor en http://localhost${PORT}`);
})
