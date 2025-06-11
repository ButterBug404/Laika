import { body, validationResult } from 'express-validator'

export const emailValidator = [
	body('email')
	.exists().withMessage('Email is required')
	.notEmpty()
	.escape()
	.isEmail().withMessage('Invalid email format')
	.normalizeEmail()
];

export const passwordValidator = [
	body('password')
	.exists().withMessage('Password is required')
	.escape()
	.isStrongPassword({minLength: 6, minUppercase: 1, minSymbols: 1}).withMessage('Password must contain at least 6 characters, one uppercase character, and one symbol')
]

export function validateRequest(req, res, next){
	const errors = validationResult(req);
	if (!errors.isEmpty()){
		return res.status(400).json({errors: errors.array()});
	}
	next();
}
