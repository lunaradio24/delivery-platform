import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { AuthService } from '../services/auth.service.js';
import { AuthController } from '../controllers/auth.controller.js';
import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';

const authRouter = express.Router();

const authRepository = new AuthRepository(prisma);
const userRepository = new UserRepository(prisma);
const authService = new AuthService(authRepository, userRepository);
const authController = new AuthController(authService);

/** 회원가입 API */
authRouter.post('/sign-up', signUpValidator, authController.signUp);

/** 로그인 API */

/** 로그아웃 API */

/** 토큰 재발급 API */

/** 네이버 로그인 API */

/** 카카오 로그인 API */

export { authRouter };
