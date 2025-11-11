import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { getIO, getConnectedUserIds, getConnectedUsers } from '../sockets.js';
import {
	userExists,
	insertPet,
	insertPetAlert,
	insertAdoption,
	retrievePets,
	retrievePet,
	updatePet,
	deletePet,
	deletePetAlert,
	updateAdoptionByPetId,
	retrieveMissingPetsNearLocation,
	insertPetMatch,
	retrieveUserById,
	getUsersByMunicipality,
	retrieveAdoptionPets,
	retrieveAdoptionByPetId,
	retrievePetMatchesByUserId,
	deleteAdoption
} from "./database.js";
import {
	verifyToken
} from "../utils/jwt.js";
import { compareImages, loadRecognitionModel } from '../utils/imageRecognitionService.js';
import axios from 'axios';
import { processPetImage } from '../utils/imageProcessor.js';

loadRecognitionModel();

async function comparePetImagesById(foundPetId, missingPetId) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const facesPath = path.join(__dirname, '..', '..', 'pictures', 'pets', 'faces');

    const foundPetImagePath = path.join(facesPath, `${foundPetId}.webp`);
    const missingPetImagePath = path.join(facesPath, `${missingPetId}.webp`);

		console.log("fpip: ", foundPetImagePath);
		console.log("mpip: ", missingPetImagePath);

    if (!fs.existsSync(foundPetImagePath) || !fs.existsSync(missingPetImagePath)) {
        console.warn(`Missing face image for pet ${foundPetId} or ${missingPetId}. Skipping comparison.`);
        return 0;
    }

    return await compareImages(foundPetImagePath, missingPetImagePath);
}

async function findMatchesAndNotify(foundPetId, foundPetAlertId, foundPetLocation, threshold = 0.8) {
    console.log("found alert id: ", foundPetAlertId);
    const missingPets = await retrieveMissingPetsNearLocation(foundPetLocation);

    for (const missingPet of missingPets) {
        const confidence = await comparePetImagesById(foundPetId, missingPet.id);
        if (confidence > threshold) {
            await insertPetMatch([missingPet.alert_id, foundPetAlertId, confidence]);

            const missingPetOwnerId = missingPet.user_id;
            const missingPetOwner = await retrieveUserById(missingPetOwnerId);

            if (missingPetOwner) {
                const foundPetResult = await retrievePet(foundPetId);
                const foundPet = foundPetResult[0];

                const matchPayload = {
                    missingPet: missingPet,
                    foundPet: foundPet,
                    confidence: confidence,
                    foundPetAlertId: foundPetAlertId
                };

                const replacer = (key, value) => typeof value === 'bigint' ? Number(value) : value;
                const cleanPayload = JSON.parse(JSON.stringify(matchPayload, replacer));

                const io = getIO();
                const connectedUsers = getConnectedUsers();

                if (connectedUsers.has(missingPetOwnerId)) {
                    const socketId = connectedUsers.get(missingPetOwnerId);
                    io.to(socketId).emit("newPetMatch", cleanPayload);
                    console.log(`Sent socket notification for pet match to user ${missingPetOwnerId}`);
                } else if (missingPetOwner.expo_push_token) {
                    const pushToken = missingPetOwner.expo_push_token;
                    const title = `¡Posible coincidencia para ${missingPet.name}!`;
                    const body = `Hemos encontrado una mascota parecida con una confianza del ${Math.round(confidence * 100)}%.`;
                    sendPushNotifications([pushToken], title, body, cleanPayload);
                    console.log(`Sent push notification for pet match to user ${missingPetOwnerId}`);
                }
            }
        }
    }
}

async function sendPushNotifications(pushTokens, title, body, data) {
	const messages = pushTokens.map(token => ({
		to: token,
		sound: 'default',
		title: title,
		body: body,
		data: data,
	}));

	try {
		await axios.post('https://exp.host/--/api/v2/push/send', messages, {
			headers: {
				'Accept': 'application/json',
				'Accept-encoding': 'gzip, deflate',
				'Content-Type': 'application/json',
			},
		});
		console.log('Push notifications sent successfully.');
	} catch (error) {
		console.error('Error sending push notifications:', error.response?.data || error.message);
	}
}

async function registerMissingAlert(userId, petId, data) {
	console.log("userId", userId);
	console.log("petId", petId);
	console.log("data.time", data.time);
	const location = parseLocation(data.last_seen_location);
	console.log("location: ", location);
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

	const user = await retrieveUserById(userId);
	const petResult = await retrievePet(petId);
	const pet = petResult[0];
	const alertPayload = { pet, user, alert: data };

	const io = getIO();
	const allUsersInMunicipality = await getUsersByMunicipality(user.municipality);
	const connectedUsers = getConnectedUsers();

	allUsersInMunicipality.forEach(u => {
		if (u.id !== userId && connectedUsers.has(u.id)) {
			const socketId = connectedUsers.get(u.id);
			io.to(socketId).emit("newMissingAlert", alertPayload);
		}
	});

	const connectedUserIds = getConnectedUserIds();

	const disconnectedUsersWithTokens = allUsersInMunicipality.filter(
		u => !connectedUserIds.includes(u.id) && u.id !== userId && u.expo_push_token
	);

	const pushTokens = disconnectedUsersWithTokens.map(u => u.expo_push_token);

	if (pushTokens.length > 0) {
		const title = 'Nueva Alerta de Mascota Perdida';
		const body = `Se ha reportado la desaparición de ${alertPayload.pet.name} en ${alertPayload.user.municipality}.`;
		sendPushNotifications(pushTokens, title, body, alertPayload);
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

export const registerFoundAlertController = async (req, res) => {
    try {
        const payload = req.user;
        const exists = await userExists(payload.id);
        if (!exists) {
            console.log("User does not exist");
            return res.status(400).json({ failure: "User not found" });
        }

        const { pet_id } = req.body;

        const pet = await retrievePet(pet_id);
        if (!pet) {
            return res.status(404).json({ failure: "Pet not found" });
        }

        const result = await registerFoundAlert(payload.id, pet_id, req.body);

        return res.status(201).json(result);
    } catch (err) {
        console.error("RegisterFoundAlert error:", err);
        return res.status(500).json({ failure: "Couldn't complete found alert registration" });
    }
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

	await findMatchesAndNotify(petId, insertedAlert.insertId, location);

	return { success: "Found pet registered", pet_id: Number(petId) };

};

const parseLocation = (locationString) => {
		console.log("lS: ", locationString);
    const [latitude, longitude] = locationString.split(",").map(parseFloat);
		console.log("CD: ", latitude);
		console.log("CC: ", longitude);
    return `POINT(${latitude} ${longitude})`;

};

export const registerPetController = async(req, res) => {
	try {
		const payload = req.user;
		const exists = await userExists(payload.id);
		if (!exists) {
			console.log("User does not exist");
			return res.status(400).json({ failure: "User not found" });
		}
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
			console.log("Processing pet images...");

			const faceImage = req.files.find(file => file.fieldname === 'faceImage');
			if (faceImage) {
				await processPetImage(faceImage.path, petId, null, true); // Process as face image
			}

			const bodyImages = req.files.filter(file => file.fieldname === 'images');
			if (bodyImages.length > 0) {
				for (let i = 0; i < bodyImages.length; i++) {
					const file = bodyImages[i];
					await processPetImage(file.path, petId, i + 1, false); // Process as body image
				}
			}
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
		const userId = req.params.userId || req.user.id;
		const petsFromDb = await retrievePets(userId);

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

		if (req.files && req.files.length > 0) {
			const petId = req.params.id;
			const __dirname = path.dirname(fileURLToPath(import.meta.url));
			const picturesPath = path.join(__dirname, '..', '..', 'pictures', 'pets');

			const faceImage = req.files.find(file => file.fieldname === 'faceImage');
			if (faceImage) {
				const facesPath = path.join(picturesPath, 'faces');
				
				const oldFaceImage = getPetImageFilenames(petId).face_image;
				if (oldFaceImage) {
					const oldFaceImagePath = path.join(facesPath, oldFaceImage);
					if (fs.existsSync(oldFaceImagePath)) {
						fs.unlinkSync(oldFaceImagePath);
					}
				}

				await processPetImage(faceImage.path, petId, null, true); // Process as face image
			}

			const bodyImages = req.files.filter(file => file.fieldname === 'images');
			if (bodyImages.length > 0) {
				const bodyPath = path.join(picturesPath, 'body');
				
				const oldBodyImages = getPetImageFilenames(petId).images;
				if (oldBodyImages && oldBodyImages.length > 0) {
					oldBodyImages.forEach(img => {
						const oldBodyImagePath = path.join(bodyPath, img);
						if (fs.existsSync(oldBodyImagePath)) {
							fs.unlinkSync(oldBodyImagePath);
						}
					});
				}

				for (let i = 0; i < bodyImages.length; i++) {
					const file = bodyImages[i];
					await processPetImage(file.path, petId, i + 1, false); // Process as body image
				}
			}
		}

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

		console.log("Delete pet: ", req.params.id);

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

export const getPetMatchesController = async (req, res) => {
    try {
        const payload = req.user;
        const matches = await retrievePetMatchesByUserId(payload.id);
        return res.status(200).json(matches);
    } catch (err) {
        console.error("GetPetMatches error:", err.message);
        return res.status(500).json({ failure: "Couldn't get pet matches" });
    }
};

export const getPetBodyPictureController = async (req, res) => {

	try {
		const { pet_id, image_number } = req.params;
		console.log(`getPetBodyPictureController: pet_id=${pet_id}, image_number=${image_number}`);
		const __dirname = path.dirname(fileURLToPath(import.meta.url));
		const bodyPath = path.join(__dirname, '..', '..', 'pictures', 'pets', 'body');

		const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
		let foundFile = null;

		for (const ext of extensions) {
			const filePath = path.join(bodyPath, `${pet_id}_${image_number}${ext}`);
			console.log(`getPetBodyPictureController: Checking for file at ${filePath}`);
			if (fs.existsSync(filePath)) {
				foundFile = filePath;
				break;
			}
		}
		console.log(`getPetBodyPictureController: Found file at ${foundFile}`);

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
		console.error("GetPetBodyPicture error:", err);

		return res.status(500).json({ failure: "Couldn't get pet body picture" });
	}
};

export const testAlertController = async (req, res) => {
	try {
		const { municipality } = req.params;
		const io = getIO();
		const testUserId = 0; // A placeholder ID for the "sender" in a test scenario

		const mockData = {
			pet: {
				id: 999,
				name: "Test Pet",
				species: "DOG",
			},
			user: {
				id: testUserId,
				name: "Test User",
				municipality: municipality,
			},
			alert: {
				description: "This is a test alert.",
				time: new Date().toISOString(),
				last_seen_location: "POINT(-103.3496 20.6597)",
			}
		};

		// Emit to connected users in the municipality
		io.to(municipality).emit("newMissingAlert", mockData);

		// Logic to send push notifications to disconnected users
		const allUsersInMunicipality = await getUsersByMunicipality(municipality);
		const connectedUserIds = getConnectedUserIds();

		const disconnectedUsersWithTokens = allUsersInMunicipality.filter(
			u => !connectedUserIds.includes(u.id) && u.id !== testUserId && u.expo_push_token
		);

		const pushTokens = disconnectedUsersWithTokens.map(u => u.expo_push_token);

		if (pushTokens.length > 0) {
			const title = 'Alerta de Prueba de Mascota';
			const body = `Se ha enviado una alerta de prueba en ${municipality}.`;
			sendPushNotifications(pushTokens, title, body, mockData);
		}

		return res.status(200).json({ success: `Test alert sent to ${municipality} (connected and disconnected users)` });
	} catch (err) {
		console.error("TestAlert error:", err);
		return res.status(500).json({ failure: "Couldn't send test alert" });
	}
};

export const getAdoptionPetsController = async (req, res) => {
	try {
		const petsFromDb = await retrieveAdoptionPets();

		const pets = petsFromDb.map(pet => {
			const imageFilenames = getPetImageFilenames(pet.id);
			return {
				...pet,
				...imageFilenames
			};
		});

		return res.status(200).json(pets);
	} catch (err) {
		console.error("GetAdoptionPets error:", err.message);
		return res.status(500).json({ failure: "Couldn't get adoption pets" });
	}
};

export const deleteAdoptionController = async (req, res) => {
	try {
		const payload = req.user;
		const { petId } = req.params;

		const petResult = await retrievePet(petId);
		if (!petResult || petResult.length === 0) {
			return res.status(404).json({ failure: "Pet not found" });
		}

		const pet = petResult[0];
		if (pet.user_id !== payload.id) {
			return res.status(403).json({ failure: "You are not authorized to modify this pet's adoption status" });
		}

		const result = await deleteAdoption(petId);

		if (result && result.affectedRows > 0) {
			return res.status(200).json({ success: "Adoption record deleted" });
		} else {
			return res.status(404).json({ failure: "Adoption record not found or already deleted" });
		}
	} catch (err) {
		console.error("DeleteAdoption error:", err);
		return res.status(500).json({ failure: "Couldn't delete adoption record" });
	}
};


export const registerPetControllerButTest = async(req, res) => {
	try {
		console.log("THE BODY: ", req.body);
		const {
			record_type, name, species, breed,
			color, age, age_unit, sex,
			size, vaccinated, description, skin_condition
		} = req.body;
		const insertedPet = await insertPet([
			1,
			name, species, breed,
			color, age, age_unit, sex,
			size, vaccinated, description, skin_condition
		]);
		if (!insertedPet) {
			console.log("Insert pet failed");
			return res.status(500).json({ failure: "Couldn't complete pet registration" });

		}

		const petId = Number(insertedPet.insertId);

		console.log('Type of insertId:', typeof petId);
		if (req.files && req.files.length > 0) {
			console.log("Processing pet images...");

			const faceImage = req.files.find(file => file.fieldname === 'faceImage');
			if (faceImage) {
				await processPetImage(faceImage.path, petId, null, true); // Process as face image
			}

			const bodyImages = req.files.filter(file => file.fieldname === 'images');
			if (bodyImages.length > 0) {
				for (let i = 0; i < bodyImages.length; i++) {
					const file = bodyImages[i];
					await processPetImage(file.path, petId, i + 1, false); // Process as body image
				}
			}
		}
		console.log("Magic 5");
		let result;
		if (record_type === 'LOST') {
			result = await registerMissingAlert(1, petId, req.body);
		} else if (record_type === 'ADOPTION') {
			result = await registerAdoption(1, petId, req.body);
		} else if (record_type === 'FOUND') {
			result = await registerFoundAlert(1, petId, req.body);
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

export const updateAdoptionController = async(req, res) => {
	try {
		const payload = req.user;
		const exists = await userExists(payload.id);
		if (!exists) {
			console.log("User does not exist");
			return res.status(400).json({ failure: "User not found" });
		}

		const { pet_id } = req.params;

		const pet = await retrievePet(pet_id);
		if (!pet || pet[0].user_id !== payload.id) {
			return res.status(403).json({ failure: "Pet not found or you are not the owner" });
		}

		const adoption = await retrieveAdoptionByPetId(pet_id);
		if (!adoption) {
			return res.status(404).json({ failure: "Adoption not found for this pet" });
		}

		await updateAdoptionByPetId(pet_id, req.body);

		return res.status(200).json({ success: "Adoption updated" });
	} catch (err) {
		console.error("UpdateAdoption error:", err);
		return res.status(500).json({ failure: "Couldn't update adoption" });
	}
};
