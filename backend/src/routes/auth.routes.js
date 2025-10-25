//External packages
import express from 'express';
import multer from 'multer';
//Local packages
import { loginController, userRegistrationController, logoutController } from '../controllers/auth.controller.js';
import { passwordValidator, emailValidator, validateRequest, textValidator, numValidator } from '../utils/validators.js';
import { authRequired } from '../utils/jwt.js';
export const authRouter = express.Router();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'pictures', 'profile'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

const registerUserValidators = [
	textValidator('name'),
	textValidator('pat_name'),
	textValidator('mat_name'),
	...emailValidator,
	...passwordValidator,
	numValidator('phone'),
	textValidator('state'),
	textValidator('municipality')
];

authRouter.post('/login',
	[...passwordValidator, ...emailValidator],
	validateRequest,
	loginController
)

authRouter.post('/register',
	upload.single('profileImage'),
	registerUserValidators,
	validateRequest,
	userRegistrationController
)

authRouter.post('/logout', authRequired, logoutController);
