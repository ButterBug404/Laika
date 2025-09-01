//External packages
import express from 'express';
//Local packages
import { registerPet } from '../controllers/pets.controller.js';
import { 
	validateRequest, 
	textValidator,
	collectionValidator,
	numValidator
} from '../utils/validators.js';
export const petsRouter = express.Router();

const Species = Object.freeze({
	DOG: "DOG",
	CAT: "CAT"
});

const Sex = Object.freeze({
	MALE: "MALE",
	FEMALE: "FEMALE"
});

const Size = Object.freeze({
	SMALL: "SMALL",
	MEDIUM: "MEDIUM",
	LARGE: "LARGE"
});

const registerPetValidators = [
	textValidator('bio'),
	textValidator('name'),
	collectionValidator('species', Species),
	textValidator('breed'),
	textValidator('color'),
	numValidator('age'),
	collectionValidator('sex', Sex),
	collectionValidator('size', Size),
	textValidator('markings')
];


adoptionRouter.post('/register_pet',
	registerPetValidators,
	validateRequest,
	registerPetController
)

