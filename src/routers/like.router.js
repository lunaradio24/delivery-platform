import express from 'express';
import { prisma } from '../utils/prisma.util';
import { LikeRepository } from '../repositories/like.repository.js';
import { LikeService } from '../services/like.service.js';
import { LikeController } from '../controllers/like.controller.js';

const likeRouter = express.Router();

const likeRepository = new LikeRepository(prisma);
const likeService = new LikeService(likeRepository);
const likeController = new LikeController(likeService);

// 가게 찜하기/취소 API

// 내가 찜한 음식점 목록 API

export { likeRouter };
