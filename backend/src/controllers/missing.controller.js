import{
	userExists,
	insertMissingAlert
} from "./database.js";
import {
	verifyToken
} from "../utils/jwt.js";

export const registerMissingAlertController = async(req, res) => {
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
			pet_id, time, location, circumstances
		} = req.body;
		const insertedAlert = await insertMissingAlert([
			payload.user_id
			pet_id,
			time,
			location,
			circumstances
		]);
		if(insertedAlert){
			return res.status(201).json({ success: "Missing alert registered"});
		} else {
			console.log("Insert ped failed");
			return res.status(500).json({ failure: "Couldn't complete pet registration"});
		}
	}catch(err){
		console.error("RegisterMissingAlert error:", err.message);
		return res.status(500).json({ failure: "Couldn't complete missing alert registration"});
	}
}
