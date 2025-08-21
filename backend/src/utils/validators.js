import { body, validationResult } from 'express-validator'

export const usernameValidator = [
	body('username')
	.exists().withMessage('Username is required')
	.notEmpty()
	.escape()
];

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

export const textValidator = (fieldName, options = {}) => {
  const chain = body(fieldName)
    .optional({ checkFalsy: options.optional ?? true })
    .isLength({ max: options.max ?? 500 }).withMessage("Text too long")
    .trim();
  if (options.escape) chain.escape();
  return chain;
};

export function validateRequest(req, res, next){
	const errors = validationResult(req);
	if (!errors.isEmpty()){
		return res.status(400).json({errors: errors.array()});
	}
	next();
}
