import express from 'express';
import { likeController } from '../di/dependency-injected-instances.js';
import { likeValidator } from '../middlewares/validators/like-validator.middleware.js';

const likeRouter = express.Router();

// 가게 찜하기/취소 API
likeRouter.post('/', likeValidator, likeController.likeOrUnlike);

// 내가 찜한 음식점 목록 API
likeRouter.get('/my', likeController.readLikedStores);

export { likeRouter };
