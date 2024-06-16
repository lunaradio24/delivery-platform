import express from 'express';
import { prisma } from '../utils/prisma.util';
import { LikeRepository } from '../repositories/like.repository.js';
import { LikeService } from '../services/like.service.js';
import { LikeController } from '../controllers/like.controller.js';

const likeRouter = express.Router();

const likeRepository = new LikeRepository(prisma);
const likeService = new LikeService(likeRepository);
const likeController = new LikeController(likeService);

// 가게 좋아요/취소 API

export { likeRouter };
