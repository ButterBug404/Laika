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
		console.log("Deaths of 42 fans");
		console.log(req.body);
		const user = await retrieveUser(req.body.email);
		if(!user){
			res.status(200).json({failure: "Incorrect email"})
			console.log("Incorrect email");
		}
		const passwordMatch = await verifyPassword(req.body.password, user[0].password_hash);
		if(passwordMatch){
			const  [token] = generateToken(user);
			res.status(200).json({ token: token});
		}else{
			res.status(200).json({ failure: "Incorrect password"});
			console.log("Incorrect password");
		}
	}catch(err){
		console.log("Error bih ", err.message, err.line);
		res.status(500).json({error: err.message, line: err.line})
	}
};

export const userRegistrationController = async (req, res) => {
	try{
		console.log("Worked!");
		const user = req.body;
		const hashedPassword = await hashPassword(user.password);
		const { password, ...userNoPass} = user
		const newUser = {
			...userNoPass,
			password_hash: hashedPassword,
		}
		console.log(newUser);
		const registeredUser = await insertUser(newUser);
		if(registeredUser != undefined){
			res.status(200).json({success: "User registration was successful"});
		}else{
			res.status(200).json({failure: "Something went wrong when registering a new user"})
		}
	}catch(err){
		res.status(500).json({error: err.message, line: err.line});
	}
}
