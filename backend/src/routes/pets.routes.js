
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

//Local packages
import { 
	registerPetController, 
	getPetsController,
	getPetByIdController,
	registerMissingAlertController,
	registerAdoptionController,
	updatePetController,
	deletePetController,
	deletePetAlertController,
	getPetFacePictureController,
	getPetBodyPictureController,
	getPetMatchesController,
	testAlertController,
	getAdoptionPetsController
} from '../controllers/pets.controller.js';
import { 
	validateRequest, 
	textValidator,
	collectionValidator,
	numValidator,
	dateTimeValidator,
	boolValidator
} from '../utils/validators.js';
import { authRequired } from '../utils/jwt.js';

export const petsRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = path.join(__dirname, '..', '..', 'pictures', 'pets');
    if (file.fieldname === "faceImage") {
      dest = path.join(dest, 'faces');
    } else if (file.fieldname === "images") {
      dest = path.join(dest, 'body');
    }
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension)
  }
})

const upload = multer({ storage: storage })

const RecordType = Object.freeze({
	PRESENT: "PRESENT",
	LOST: "LOST",
	ADOPTION: "ADOPTION"
});

const Species = Object.freeze({
	DOG: "DOG",
	CAT: "CAT",
	OTHER: "OTHER"
});

const Sex = Object.freeze({
	MALE: "MALE",
	FEMALE: "FEMALE",
	UNKNOWN: "UNKNOWN"
});

const Size = Object.freeze({
	SMALL: "SMALL",
	MEDIUM: "MEDIUM",
	BIG: "BIG"
});

const AgeUnit = Object.freeze({
	MONTHS: "MONTHS",
	YEARS: "YEARS"
});

const ContactMethod = Object.freeze({
	EMAIL: "EMAIL",
	WHATSAPP: "WHATSAPP",
	BOTH: "BOTH"
});

const registerPetValidators = [
	collectionValidator('record_type', RecordType),
	textValidator('name'),
	collectionValidator('species', Species),
	textValidator('breed'),
	textValidator('color'),
	numValidator('age'),
	collectionValidator('age_unit', AgeUnit),
	collectionValidator('sex', Sex),
	collectionValidator('size', Size),
	boolValidator('vaccinated'),
	textValidator('description'),
	boolValidator('skin_condition')
];

petsRouter.post('/register_pet',
	authRequired,
	upload.any(),
	registerPetValidators,
	validateRequest,
	registerPetController
);

petsRouter.post('/register_alert', authRequired, registerMissingAlertController);

petsRouter.post('/register_adoption', authRequired, upload.any(), registerAdoptionController);

petsRouter.put('/update_pet/:id', authRequired, upload.any(), updatePetController);

petsRouter.delete('/delete_pet/:id', authRequired, deletePetController);

petsRouter.get('/get_pet/:id', authRequired, getPetByIdController);

petsRouter.get('/get_pets', authRequired, getPetsController);

petsRouter.delete('/delete_pet_alert/:id', authRequired, deletePetAlertController);

petsRouter.get('/pet-pictures/:pet_id/faces', authRequired, getPetFacePictureController);

petsRouter.get('/pet-pictures/:pet_id/body/:image_number', authRequired, getPetBodyPictureController);
petsRouter.get('/matches', authRequired, getPetMatchesController);

petsRouter.get('/test-alert/:municipality', testAlertController);

petsRouter.get('/adoption', authRequired, getAdoptionPetsController);
