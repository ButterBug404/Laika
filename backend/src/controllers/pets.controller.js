import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import{
	userExists,
	insertPet,
	insertPetAlert,
	insertAdoption,
	retrievePets,
	retrievePet,
	updatePet,
	deletePet,
	deletePetAlert
} from "./database.js";
import {
	verifyToken
} from "../utils/jwt.js";

async function registerMissingAlert(userId, petId, data) {
	console.log("userId", userId);
	console.log("petId", petId);
	console.log("data.time", data.time);
	const location = parseLocation(data.last_seen_location);
	const hasReward = data.has_reward === 'true' || data.has_reward === true;
	const insertedAlert = await insertPetAlert([
		userId,
		petId,
		'MISSING',
		data.time,
		location,
		data.description,
		data.contact_info,
		data.contact_method,
		hasReward,
		data.reward_description,
		data.reward_amount
	]);
	if (!insertedAlert) {
		throw new Error("Insert missing alert failed");
	}
	return { success: "Missing pet registered", pet_id: Number(petId) };
};

export const registerMissingAlertController = async (req, res) => {
    try {
        const payload = req.user;
        const exists = await userExists(payload.id);
        if (!exists) {
            console.log("User does not exist");
            return res.status(400).json({ failure: "User not found" });
        }

        const { pet_id } = req.body;

        const pet = await retrievePet(pet_id, payload.id);
        if (!pet) {
            return res.status(404).json({ failure: "Pet not found or you are not the owner" });
        }

        const result = await registerMissingAlert(payload.id, pet_id, req.body);

        return res.status(201).json(result);
    } catch (err) {
        console.error("RegisterMissingAlert error:", err);
        return res.status(500).json({ failure: "Couldn't complete missing alert registration" });
    }
};

export const registerAdoption = async (userId, petId, data) => {
	const insertedAdoption = await insertAdoption([
		petId,
		userId,
		data.description,
		data.contact_info,
		data.contact_method
	]);

	if (!insertedAdoption) {
		throw new Error("Insert adoption failed");
	}

	return { success: "Adoption pet registered", pet_id: Number(petId) };
};

export const registerFoundAlert = async (userId, petId, data) => {
	const location = parseLocation(data.last_seen_location);
	const insertedAlert = await insertPetAlert([
		userId,
		petId,
		'FOUND',
		data.time,
		location,
		data.description,
		data.contact_info,
		data.contact_method,
		0,
		undefined,
		undefined
	]);

	if (!insertedAlert) {
		throw new Error("Insert found alert failed");
	}

	return { success: "Found pet registered", pet_id: Number(petId) };

};

const parseLocation = (locationString) => {
    const [longitude, latitude] = locationString.split(",").map(parseFloat);
    return `POINT(${longitude} ${latitude})`;
};

export const registerPetController = async(req, res) => {
	try {
		const payload = req.user;
		const exists = await userExists(payload.id);
		if (!exists) {
			console.log("User does not exist");
			return res.status(400).json({ failure: "User not found" });
		}
		console.log("Magic");
		console.log(req.body);
		const {
			record_type, name, species, breed,
			color, age, age_unit, sex,
			size, vaccinated, description, skin_condition
		} = req.body;
		const insertedPet = await insertPet([
			payload.id,
			name, species, breed,
			color, age, age_unit, sex,
			size, vaccinated, description, skin_condition
		]);
		console.log("Magic 2");
		if (!insertedPet) {
			console.log("Insert pet failed");
			return res.status(500).json({ failure: "Couldn't complete pet registration" });
		}
		console.log("Magic 3");
		const petId = Number(insertedPet.insertId);
		console.log('Type of insertId:', typeof petId);
		if (req.files && req.files.length > 0) {
			console.log("Magic 4");
			req.files.forEach((file, index) => {
				console.log(file);
				const dir = path.dirname(file.path);
				const ext = path.extname(file.originalname);
				const newFilename = `${petId}_${index + 1}${ext}`;
				const newPath = path.join(dir, newFilename);
				console.log(`Attempting to rename: ${file.path} to ${newPath}`);
				fs.renameSync(file.path, newPath);
			});
		}
		console.log("Magic 5");
		let result;
		if (record_type === 'LOST') {
			result = await registerMissingAlert(payload.id, petId, req.body);
		} else if (record_type === 'ADOPTION') {
			result = await registerAdoption(payload.id, petId, req.body);
		} else if (record_type === 'FOUND') {
			result = await registerFoundAlert(payload.id, petId, req.body);
		} else {
			result = { success: "Pet registered", petId };
		}
		console.log("Magic 6");
		console.log(result);
		return res.status(201).json(result);
	} catch (err) {
		console.error("RegisterPet error:", err);
		return res.status(500).json({ failure: "Couldn't complete pet registration" });
	}
};

export const registerAdoptionController = async(req, res) => {
	try {
		const payload = req.user;
		const exists = await userExists(payload.id);
		if (!exists) {
			console.log("User does not exist");
			return res.status(400).json({ failure: "User not found" });
		}

		const { pet_id } = req.body;

		const pet = await retrievePet(pet_id, payload.id);
		if (!pet) {
			return res.status(404).json({ failure: "Pet not found or you are not the owner" });
		}

		const result = await registerAdoption(payload.id, pet_id, req.body);

		return res.status(201).json(result);
	} catch (err) {
		console.error("RegisterAdoption error:", err);
		return res.status(500).json({ failure: "Couldn't complete adoption registration" });
	}
};

const getPetImageFilenames = (petId) => {
	const __dirname = path.dirname(fileURLToPath(import.meta.url));
	const petsPicturesPath = path.join(__dirname, '..', '..', 'pictures', 'pets');
	const facesPath = path.join(petsPicturesPath, 'faces');
	const bodyPath = path.join(petsPicturesPath, 'body');

	let face_image = null;
	const images = [];

	try {
		const facesDir = fs.readdirSync(facesPath);
		const faceFile = facesDir.find(file => file.startsWith(`${petId}.`));
		if (faceFile) {
			face_image = faceFile;
		}

		const bodyDir = fs.readdirSync(bodyPath);
		const bodyFiles = bodyDir.filter(file => file.startsWith(`${petId}_`));
		images.push(...bodyFiles);
		console.log(bodyFiles);

	} catch (error) {
		console.error(`Error scanning for images for pet ${petId}:`, error);
	}

	return { face_image, images };
};

export const getPetsController = async(req, res) => {
	try {
		const payload = req.user;
		const petsFromDb = await retrievePets(payload.id);

		const pets = petsFromDb.map(pet => {
			const imageFilenames = getPetImageFilenames(pet.id);
			return {
				...pet,
				...imageFilenames
			};
		});

		return res.status(200).json(pets);
	} catch (err) {
		console.error("GetPets error:", err.message);
		return res.status(500).json({ failure: "Couldn't get pets" });
	}
};

export const updatePetController = async(req, res) => {
	try {
		const payload = req.user;
		const exists = await userExists(payload.id);
		if (!exists) {
			console.log("User does not exist");
			return res.status(400).json({ failure: "User not found" });
		}

		await updatePet(req.params.id, req.body);

		return res.status(200).json({ success: "Pet updated" });
	} catch (err) {
		console.error("UpdatePet error:", err);
		return res.status(500).json({ failure: "Couldn't update pet" });
	}
};

export const deletePetController = async(req, res) => {
	try {
		const payload = req.user;
		const exists = await userExists(payload.id);
		if (!exists) {
			console.log("User does not exist");
			return res.status(400).json({ failure: "User not found" });
		}

		await deletePet(req.params.id);

		return res.status(200).json({ success: "Pet deleted" });
	} catch (err) {
		console.error("DeletePet error:", err);
		return res.status(500).json({ failure: "Couldn't delete pet" });
	}
};

export const getPetByIdController = async(req, res) => {
	try {
		const payload = req.user;
		const petFromDb = await retrievePet(req.params.id, payload.id);

		if (!petFromDb) {
			return res.status(404).json({ failure: "Pet not found" });
		}

		console.log(petFromDb.id);
		const imageFilenames = getPetImageFilenames(petFromDb.id);

		const pet = {
			...petFromDb,
			...imageFilenames
		};

		return res.status(200).json(pet);
	} catch (err) {
		console.error("GetPetById error:", err.message);
		return res.status(500).json({ failure: "Couldn't get pet" });
	}
};

export const deletePetAlertController = async(req, res) => {
	try {
		const payload = req.user;
		const exists = await userExists(payload.id);
		if (!exists) {
			console.log("User does not exist");
			return res.status(400).json({ failure: "User not found" });
		}
		await deletePetAlert(req.params.id);

		return res.status(200).json({ success: "Pet alert deleted" });
	} catch (err) {
		console.error("deletePetAlertController error:", err);
		return res.status(500).json({ failure: "Couldn't delete pet alert" });
	}
};

export const getPetFacePictureController = async (req, res) => {
	try {
		const { pet_id } = req.params;
		const __dirname = path.dirname(fileURLToPath(import.meta.url));
		const facesPath = path.join(__dirname, '..', '..', 'pictures', 'pets', 'faces');

		const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
		let foundFile = null;

		for (const ext of extensions) {
			const filePath = path.join(facesPath, `${pet_id}${ext}`);
			console.log(filePath);
			if (fs.existsSync(filePath)) {
				foundFile = filePath;
				break;
			}
		}

		if (!foundFile) {
			console.error("getPetFacePictureController: File not found: ", pet_id);
			return res.status(404).json({ failure: "Pet face picture not found" });
		}

		const ext = path.extname(foundFile).toLowerCase();
		const contentTypes = {
			'.jpg': 'image/jpeg',
			'.jpeg': 'image/jpeg',
			'.png': 'image/png',
			'.webp': 'image/webp'
		};

		res.setHeader('Content-Type', contentTypes[ext] || 'image/jpeg');
		res.setHeader('Cache-Control', 'public, max-age=86400');

		const fileStream = fs.createReadStream(foundFile);
		fileStream.pipe(res);

		fileStream.on('error', (error) => {
			console.error("Error streaming file:", error);
			if (!res.headersSent) {
				res.status(500).json({ failure: "Error reading image file" });
			}
		});
	} catch (err) {

		console.error("GetPetFacePicture error:", err);
		return res.status(500).json({ failure: "Couldn't get pet face picture" });
	}
};

export const getPetBodyPictureController = async (req, res) => {

	try {
		const { pet_id, image_number } = req.params;
		const __dirname = path.dirname(fileURLToPath(import.meta.url));
		const bodyPath = path.join(__dirname, '..', '..', 'pictures', 'pets', 'body');

		const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
		let foundFile = null;

		for (const ext of extensions) {
			const filePath = path.join(bodyPath, `${pet_id}_${image_number}${ext}`);
			if (fs.existsSync(filePath)) {

				foundFile = filePath;

				break;
			}
		}

		if (!foundFile) {

			return res.status(404).json({ failure: "Pet body picture not found" });
		}

		const ext = path.extname(foundFile).toLowerCase();

		const contentTypes = {
			'.jpg': 'image/jpeg',
			'.jpeg': 'image/jpeg',
			'.png': 'image/png',
			'.webp': 'image/webp'
		};

		res.setHeader('Content-Type', contentTypes[ext] || 'image/jpeg');
		res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours

		const fileStream = fs.createReadStream(foundFile);
		fileStream.pipe(res);

		fileStream.on('error', (error) => {
			console.error("Error streaming file:", error);
			if (!res.headersSent) {
				res.status(500).json({ failure: "Error reading image file" });
			}
		});
	} catch (err) {
		console.error("GetPetBodyPicture error:", err);

		return res.status(500).json({ failure: "Couldn't get pet body picture" });
	}
};
