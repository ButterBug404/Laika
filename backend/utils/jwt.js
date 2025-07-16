import jwt from 'jsonwebtoken';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const privateKeyPath = path.join(__dirname, '../keys/private.key')
const publicKeyPath = path.join(__dirname, '../keys/public.key')

export function generateToken(user, expiration = 1){
	const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
	const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
	console.log("PENE3")
	const token = jwt.sign(user[0], privateKey, 
		{algorithm: 'RS256', expiresIn: expiration+"h"}
	)
	console.log("PENE4")
	return [token, publicKey];
}
