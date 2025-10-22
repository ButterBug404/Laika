import { retrieveUserById } from "./database.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export const getProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json({ failure: "User ID not found in token" });
        }

        const profilePictureDir = path.join(__dirname, '../../pictures/profile');
        const potentialExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
        let picturePath = null;

        for (const ext of potentialExtensions) {
            const potentialPath = path.join(profilePictureDir, `${userId}${ext}`);
            if (fs.existsSync(potentialPath)) {
                picturePath = potentialPath;
                break;
            }
        }

        if (picturePath) {
            res.sendFile(picturePath);
        } else {
            res.status(404).json({ failure: "Profile picture not found" });
        }
    } catch (err) {
        console.error("getProfilePicture error", err.message);
        return res.status(500).json({ error: err.message });
    }
};