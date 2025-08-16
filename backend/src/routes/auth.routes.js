//External packages
import express from 'express';
//Local packages
import { loginController, userRegistrationController } from '../controllers/auth.controller.js';
import { passwordValidator, emailValidator, validateRequest } from '../utils/validators.js';
export const authRouter = express.Router();

authRouter.post('/login',
	[...passwordValidator, ...emailValidator],
	validateRequest,
	loginController
)

authRouter.post('/register',
	[...passwordValidator, ...emailValidator],
	validateRequest,
	userRegistrationController
)
