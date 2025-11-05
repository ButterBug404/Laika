import express from 'express';
import { getUserById, getProfilePictureController, updateProfilePicture, updateUserProfile, updatePasswordController } from '../controllers/user.controller.js';
import { authRequired } from '../utils/jwt.js';
import { updatePasswordValidator, validateRequest } from '../utils/validators.js';
import multer from 'multer';

const upload = multer({ dest: 'pictures/profile' });

export const userRouter = express.Router();

userRouter.put('/update-user', authRequired, updateUserProfile);
userRouter.put('/update-password', 
    authRequired, 
    ...updatePasswordValidator, 
    validateRequest, 
    updatePasswordController
);
userRouter.put('/update-profile-picture', authRequired, upload.single('profilePicture'), updateProfilePicture);
userRouter.get('/users/:id', authRequired, getUserById);
userRouter.get('/profile-pictures/:user_id', authRequired, getProfilePictureController);
