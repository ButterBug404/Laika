//External packages
import express from 'express';
//Local packages
import { loginController, userRegistrationController } from '../controllers/auth.controller.js';
import { passwordValidator, emailValidator, validateRequest, textValidator, numValidator } from '../utils/validators.js';
export const authRouter = express.Router();

const registerUserValidators = [
	textValidator('name'),
	textValidator('pat_name'),
	textValidator('mat_name'),
	...emailValidator,
	...passwordValidator,
	numValidator('phone'),
	textValidator('state'),
	textValidator('municipality')
];

authRouter.post('/login',
	[...passwordValidator, ...emailValidator],
	validateRequest,
	loginController
)

authRouter.post('/register',
	registerUserValidators,
	validateRequest,
	userRegistrationController
)
