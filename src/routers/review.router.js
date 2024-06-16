import express from 'express';
import { prisma } from '../utils/prisma.util';
import { ReviewRepository } from '../repositories/review.repository.js';
import { ReviewService } from '../services/review.service.js';
import { ReviewController } from '../controllers/review.controller.js';

const reviewRouter = express.Router();

const reviewRepository = new ReviewRepository(prisma);
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService);

// 리뷰 작성 API

// 리뷰 목록 조회 API

// 리뷰 수정 API

// 리뷰 삭제 API

export { reviewRouter };
