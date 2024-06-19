import express from 'express';
import { userController } from '../di/dependency-injected-instances.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';

const userRouter = express.Router();

/** 프로필 API */
userRouter.get('/me', requireAccessToken, userController.getMyInfo);

/** 프로필 수정 API */
userRouter.patch('/me', requireAccessToken, userController.patchMyInfo);

export { userRouter };
