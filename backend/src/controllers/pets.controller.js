import{
	userExists,
	insertPet
} from "./database.js";
import {
	verifyToken
} from '../utils/jwt.js";

export const registerPetController = async(req, res) => {
	try{
		const token = req.headers.authorization?.split(" ")[1];
		if(!token) {
			return res.status(401).json({ failure: "Missing or invalid token" });
		}
		const payload = verifyToken(token);
		const exists = await userExists(payload.user_id);
		if (!exists) {
			console.log("User does not exist");
			return res.status(400).json({failure: "User not found" });
		}
		const {
			name, species, breed,
			color, age, sex,
			size, markings
		} = req.body;
		const insertedPet = await insertPet([ 
			payload.user_id,
			name, species, breed,
			color, age, sex,
			size, markings
		]);
		if(insertedPet) {
			return res.status(201).json({ success: "Pet registered"});
		} else {
			console.log("Insert ped failed");
			return res.status(500).json({ failure: "Couldn't complete pet registration"});
		}
	}catch(err){
		console.error("RegisterPet error:", err.message);
		return res.status(500).json({ failure: "Couldn't complete pet registration"});
	}
};
