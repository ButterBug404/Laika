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

export const numValidator = (fieldName, options = {}) => {
	const chain = body(fieldName)
		.optional({checkFalsy: options.optional ?? true})
		.exists().withMessage(`Field "${fieldName}" was expected`)
		.escape()
		.trim()
		.isNumeric().withMessage(`Field "${fieldName} isn't numeric"`)
	if (options.escape) chain.escape();
	return chain;
};

export const boolValidator = (fieldName, options = {}) => {
  const chain = body(fieldName)
    .optional({ checkFalsy: options.optional ?? true })
    .exists().withMessage(`Field "${fieldName}" was expected`)
    .trim()
    .toLowerCase()
    .isIn(["true", "false", "1", "0"])
    .withMessage(`Field "${fieldName}" must be a boolean`)
    .customSanitizer(value => {
      return value === "true" || value === "1";
    });

  if (options.escape) chain.escape();
  return chain;
};


function toMariaDbDateTime(isoString) {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) throw new Error("Invalid date");
  return d.toISOString().slice(0, 19).replace("T", " ");
}

export const dateTimeValidator = (fieldName, options = {}) => {
	const chain = body(fieldName)
		.exists().withMessage(`Field "${fieldName}" was expected`)
		.trim()
		.isISO8601()
		.withMessage("Date must be in ISO8601 format")
		.customSanitizer(value => toMariaDbDateTime(value));
	if(options.escape) chain.escape();
	return chain;
}

export const collectionValidator = (fieldName, collection, options = {}) => {
	const chain = body(fieldName)
		.optional({checkFalsy: options.optional ?? true})
		.exists().withMessage(`Field "${fieldName}" was expected`)
		.trim()
		.isIn(Object.values(collection)).withMessage(`Field "${fieldName}" isn't part of the collection`)
	if (options.escape) chain.escape();
	return chain;
};

export function pointValidator(fieldName = "point") {
  return body(fieldName)
    .matches(/^[-+]?\d+(\.\d+)?,[-+]?\d+(\.\d+)?$/)
    .withMessage("Point must be 'lat,lng' like 12.34,56.789")
    .customSanitizer(value => {
      const [x, y] = value.split(",").map(Number);
      return `POINT(${x} ${y})`;
    });
}

export function validateRequest(req, res, next){
	const errors = validationResult(req);
	if (!errors.isEmpty()){
		console.error('Validation errors:', errors.array());
		return res.status(400).json({errors: errors.array()});
	}
	next();
}
