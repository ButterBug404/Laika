
import jwt from 'jsonwebtoken';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const privateKeyPath = path.join(__dirname, '../../keys/private.key')

// For a production environment, a more robust solution like Redis with TTL (time-to-live)
// should be used to automatically clear out expired tokens from the blocklist.
const tokenBlocklist = new Set();

export function generateToken(user, expiration = 1){
	const { password_hash, ...userSafe } = user[0];
	const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
	const token = jwt.sign(userSafe, privateKey, 
		{algorithm: 'RS256', expiresIn: expiration+"h"}
	)
	return [token];
}

export function verifyToken(token){
	const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
	return jwt.verify(token, privateKey);
}

export function invalidateToken(token) {
	tokenBlocklist.add(token);
}

export const authRequired = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  if (tokenBlocklist.has(token)) {
    return res.status(401).json({ message: "Token is not valid (logged out)" });
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

