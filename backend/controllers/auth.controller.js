import { 
	insertUser,
	retrieveUser,
} from "./database.js";
import { 
	hashPassword,
	verifyPassword,
} from "../utils/passwordUtils.js";
import { generateToken } from "../utils/jwt.js";

export const loginController = async (req, res) => {
	try{
		const user = await retrieveUser(req.body.email);
		if(!user){
			res.status(200).json({failure: "Incorrect email"})
		}

		if(await verifyPassword(req.body.password, user[0].password)){
			const  [token, key] = generateToken(user);
			res.status(200).json({ token: token, key: key});
		}else{
			res.status(200).json({ failure: "Incorrect password"});
		}
	}catch(err){
		res.status(500).json({error: err.message, line: err.line})
	}
};

export const userRegistrationController = async (req, res) => {
	try{
		const user = req.body;
		const registeredUser = await insertUser(user.username, hashPassword(user.password), user.email);
		if(registeredUser.insertId){
			res.status(200).json({success: "User registration was successful"});
		}else{
			res.status(200).json({failure: "Something went wrong when registering a new user"})
		}
	}catch(err){
		res.status(500).json({error: err.message, line: err.line});
	}
}
