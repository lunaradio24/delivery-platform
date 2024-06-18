import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { UserRepository } from '../repositories/user.repository.js';
import { UserService } from '../services/user.service.js';
import { UserController } from '../controllers/user.controller.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';

const userRouter = express.Router();

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

/** 프로필 API */
userRouter.get('/me', requireAccessToken, userController.getMyInfo);

/** 프로필 수정 API */

export { userRouter };
