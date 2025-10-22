import express from 'express';
import { getUserById, getProfilePicture } from '../controllers/user.controller.js';
import { authRequired } from '../utils/jwt.js';

export const userRouter = express.Router();

userRouter.get('/users/:id', authRequired, getUserById);
userRouter.get('/profile-picture', authRequired, getProfilePicture);
