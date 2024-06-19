import express from 'express';
import { userController } from '../di/dependency-injected-instances.js';
import { profileValidator } from '../middlewares/validators/profile-validator.middleware.js';

const userRouter = express.Router();

/** 프로필 API */
userRouter.get('/me', userController.getMyInfo);

/** 프로필 수정 API */
userRouter.patch('/me', profileValidator, userController.patchMyInfo);

export { userRouter };
