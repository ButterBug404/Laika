//External packages
import express from 'express';
//Local packages
import { registerMissingAlertController } from '../controllers/missing.controller.js';
import { 
	dateTimeValidator,
	numValidator,
	textValidator,
	pointValidator,
} from '../utils/validators.js';
export const missingRouter = express.router();

const registerMissingAlertValidators = [
	numValidator('pet_id'),
	dateTimeValidator('time'),
	pointValidator('location'),
	textValidator('circumstances')
];

missingRouter.post('/register_alert',
	[...registerMissingAlertValidators],
	validateRequest,
	registerMissingAlertController
)
