import jwt from 'jsonwebtoken';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const privateKeyPath = path.join(__dirname, '../../keys/private.key')

export function generateToken(user, expiration = 1){
	const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
	const token = jwt.sign(user[0], privateKey, 
		{algorithm: 'RS256', expiresIn: expiration+"h"}
	)
	return [token];
}

export function verifyToken(token){
	const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
	return jwt.verify(token, privateKey);
}
