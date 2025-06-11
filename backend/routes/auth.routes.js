//External packages
import express from 'express';
//Local packages
import { loginController } from '../controllers/auth.controller';
import { passwordValidator, emailValidator, validateRequest } from '../utils/validators';
const router = express.Router();

router.post('/login',
	[...passwordValidator, ...emailValidator],
	validateRequest,
	loginController
)
