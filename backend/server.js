//External packages
import * as tf from '@tensorflow/tfjs-node';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
//Local packages
import { retrieveUser } from './controllers/mariadb.js';
import { emailValidator, passwordValidator, validateRequest } from './utils/validators.js';
import { generateToken } from './utils/jwt.js';

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

//TODO
//Hash password
app.post('/login', [...emailValidator, passwordValidator], validateRequest, async (req, res) => {
	try{
		const user = await retrieveUser(req.body.email, req.body.password);
		if(user){
			res.status(200).json({ token: generateToken(user)});
		}else{
			res.status(200).json({ failure: "we failed!"});
		}
	}catch(err){
		res.status(500).json({error: err.message, line: err.line})
	}
});

const PORT = 3001;
app.listen(PORT, async () => {
	console.log(`Servidor en http://localhost:${PORT}`);
})
