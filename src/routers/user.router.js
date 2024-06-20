import express from 'express';
import { userController } from '../di/dependency-injected-instances.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { userImage } from '../middlewares/upload-image.middleware.js';

const userRouter = express.Router();

/** 프로필 API */
userRouter.get('/me', requireAccessToken, userController.getMyInfo);

/** 프로필 수정 API */
userRouter.patch('/me', requireAccessToken, userController.patchMyInfo);

// 이미지 업로드 API
userRouter.patch('/me/image', requireAccessToken, userImage.single('image'), userController.userImageUpload)

export { userRouter };
