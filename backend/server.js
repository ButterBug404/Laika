//External packages
import * as tf from '@tensorflow/tfjs-node';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
//Local packages
import { retrieveUser } from './controllers/mariadb.js';

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

app.post('/login', async (req, res) => {
	try{
		const user = await retrieveUser(req.body.email, "");
		console.log("the user:", user);
		if(user){
			res.status(200).json({ success: user});
		}else{
			res.status(200).json({ failure: "we failed!"});
		}
	}catch(err){
		res.status(500).json({error: err.message, line: err.line})
	}
});

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
