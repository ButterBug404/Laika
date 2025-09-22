//External packages
import express from 'express';
//Local Packages
import { registerAdopterController } from '../controllers/adoption.controller.js';
import {validateRequest, textValidator} from '../utils/validators.js';
export const adoptionRouter = express.Router();

adoptionRouter.post('/register_adopter',
	[textValidator('bio'), textValidator('experience_with_pets')],
	validateRequest,
	registerAdopterController
)
