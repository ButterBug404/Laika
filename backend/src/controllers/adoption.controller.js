import{
	userExists,
	insertAdopter
} from "./database.js";
import{
	verifyToken
} from "../utils/jwt.js";

export const registerAdopterController = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ failure: "Missing or invalid token" });
    }
    const payload = verifyToken(token);
    const exists = await userExists(payload.user_id);
    if (!exists) {
      console.log("User does not exist");
      return res.status(400).json({ failure: "User not found" });
    }
    const { bio, experience_with_pets } = req.body;
    const insertedAdopter = await insertAdopter([
      payload.user_id,
      bio,
      experience_with_pets,
      new Date()
    ]);
    if (insertedAdopter) {
      return res.status(201).json({ success: "User registered as adopter!" });
    } else {
      console.log("Insert adopter failed");
      return res.status(500).json({ failure: "Couldn't complete adopter registration" });
    }
  } catch (err) {
    console.error("RegisterAdopter error:", err.message);
    return res.status(500).json({ failure: "Couldn't complete adopter registration" });
  }
};
