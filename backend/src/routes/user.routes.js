import express from 'express';
import { getUserById, getProfilePictureController, updateProfilePicture } from '../controllers/user.controller.js';
import { authRequired } from '../utils/jwt.js';
import multer from 'multer';

const upload = multer({ dest: 'pictures/profile' });

export const userRouter = express.Router();

userRouter.put('/update-profile-picture', authRequired, upload.single('profilePicture'), updateProfilePicture);
userRouter.get('/users/:id', authRequired, getUserById);
userRouter.get('/profile-pictures/:user_id', authRequired, getProfilePictureController);
