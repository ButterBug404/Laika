import { retrieveUserById, updateUser, updatePassword, retrievePasswordById, updateUserPushToken } from "./database.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { hashPassword, verifyPassword } from '../utils/passwordUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const updatePasswordController = async (req, res) => {
	try {
		const userId = req.params.id || req.user.id;
		const { old_password, new_password } = req.body;

		console.log(userId);
		const query_result = await retrievePasswordById(userId);
		console.log(query_result);
		if (!query_result || query_result.length === 0) {
			return res.status(404).json({ failure: "User not found" });
		}

		const passwordMatch = await verifyPassword(old_password, query_result.password_hash);
		if (!passwordMatch) {
			return res.status(401).json({ failure: "Incorrect old password" });
		}

		const hashedPassword = await hashPassword(new_password);
		await updatePassword(userId, hashedPassword);

		res.status(200).json({ success: "Password updated successfully" });
	} catch (err) {
		console.error("updatePasswordController error", err.message);
		return res.status(500).json({ error: err.message });
	}
};

export const updateUserProfile = async (req, res) => {
	try {
		const { id } = req.user;
		const { name, pat_name, mat_name, email, phone } = req.body;
		await updateUser(id, { name, pat_name, mat_name, email, phone });
		res.status(200).json({ success: "User updated successfully" });
	} catch (err) {
		console.error("updateUserProfile error", err.message);
		return res.status(500).json({ error: err.message });
	}
};

export const getProfilePictureController = async (req, res) => {
	try {
		const { user_id } = req.params;
		console.log("I'm sleepy");
		const __dirname = path.dirname(fileURLToPath(import.meta.url));
		const profilesPath = path.join(__dirname, '..', '..', 'pictures', 'profile');

		const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
		let foundFile = null;

		for (const ext of extensions) {
			const filePath = path.join(profilesPath, `${user_id}${ext}`);
			if (fs.existsSync(filePath)) {
				foundFile = filePath;
				break;
			}
		}

		if (!foundFile) {
			console.error("getProfilePictureController: File not found, ", foundFile);
			return res.status(404).json({ failure: "Profile picture not found" });
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
		console.error("GetProfilePicture error:", err);
		return res.status(500).json({ failure: "Couldn't get profile picture" });
	}
};

export const getUserById = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await retrieveUserById(id);

		if (!user || user.length === 0) {
			return res.status(404).json({ failure: "User not found" });
		}

		res.status(200).json(user);
	} catch (err) {
		console.error("getUserById error", err.message);
		return res.status(500).json({ error: err.message });
	}
};

export const updateProfilePicture = async (req, res) => {
	try {
		const userId = req.user.id;
		if (!userId) {
			return res.status(400).json({ failure: "User ID not found in token" });
		}

		const profilePictureDir = path.join(__dirname, '../../pictures/profile');
		const potentialExtensions = ['.jpeg', '.jpg', '.png', '.webp'];

		for (const ext of potentialExtensions) {
			const potentialPath = path.join(profilePictureDir, `${userId}${ext}`);
			if (fs.existsSync(potentialPath)) {
				fs.unlinkSync(potentialPath);
				break;
			}
		}

		const { path: tempPath, originalname } = req.file;
		const extension = path.extname(originalname);
		const newPath = path.join(profilePictureDir, `${userId}${extension}`);
		fs.renameSync(tempPath, newPath);

		res.status(200).json({ success: "Profile picture updated" });
	} catch (err) {
		console.error("updateProfilePicture error", err.message);
		return res.status(500).json({ error: err.message });
	}
};

export const updateUserPushTokenController = async (req, res) => {
	try {
		const { userId } = req.params;
		const { expoPushToken } = req.body;

		if (req.user.id !== parseInt(userId, 10)) {
			return res.status(403).json({ failure: "Forbidden: You can only update your own push token." });
		}

		if (!expoPushToken) {
			return res.status(400).json({ failure: "Push token is required." });
		}

		await updateUserPushToken(userId, expoPushToken);

		res.status(200).json({ success: "Push token updated successfully." });
	} catch (err) {
		console.error("updateUserPushTokenController error:", err.message);
		return res.status(500).json({ error: "Failed to update push token." });
	}
};
