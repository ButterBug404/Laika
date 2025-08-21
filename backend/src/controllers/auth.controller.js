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
  try {
    const { email, password } = req.body;

    const user = await retrieveUser(email);
    if (!user || user.length === 0) {
      console.log("Incorrect email");
      return res.status(400).json({ failure: "Incorrect email" });
    }

    const passwordMatch = await verifyPassword(password, user[0].password_hash);

    if (!passwordMatch) {
      console.log("Incorrect password");
      return res.status(400).json({ failure: "Incorrect password" });
    }

    const [token] = generateToken(user);
    return res.status(200).json({ token });

  } catch (err) {
    console.error("LoginController error", err.message);
    return res.status(500).json({ error: err.message });
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
