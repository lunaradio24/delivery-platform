import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { UserRepository } from '../repositories/user.repository.js';
import { UserService } from '../services/user.service.js';
import { UserController } from '../controllers/user.controller.js';

const userRouter = express.Router();

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// 내 정보 조회 API

// 내 정보 수정 API

export { userRouter };
