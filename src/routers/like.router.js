import express from 'express';
import { likeController } from '../di/dependency-injected-instances.js';

const likeRouter = express.Router();

// 가게 찜하기/취소 API
likeRouter.post('/likes', likeController.likeOrUnlike);

// 내가 찜한 음식점 목록 API
likeRouter.get('/likes/my', likeController.readLikedStores);

export { likeRouter };
