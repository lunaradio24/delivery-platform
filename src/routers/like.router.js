import express from 'express';

import { prisma } from '../utils/prisma.util.js';
import { StoreRepository } from '../repositories/store.repository.js';
import { LikeRepository } from '../repositories/like.repository.js';
import { LikeService } from '../services/like.service.js';
import { LikeController } from '../controllers/like.controller.js';

const likeRouter = express.Router();

const storeRepository = new StoreRepository(prisma);
const likeRepository = new LikeRepository(prisma);
const likeService = new LikeService(likeRepository, storeRepository);
const likeController = new LikeController(likeService);

// 가게 찜하기/취소 API
likeRouter.post('/likes', likeController.likeOrUnlike);

// 내가 찜한 음식점 목록 API
likeRouter.get('/likes/my', likeController.readLikedStores);

export { likeRouter };
