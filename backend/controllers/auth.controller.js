import { retrieveUser } from "./database";
import { verifyPassword } from "../utils/passwordUtils";
import { generateToken } from "../utils/jwt";

export const loginController = async (req, res) => {
	try{
		const user = await retrieveUser(req.body.email);
		if(!user){res.status(200).json({failure: "Incorrect email"})}
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
