import express from 'express';
import { prisma } from '../utils/prisma.util';
import { ReviewRepository } from '../repositories/review.repository.js';
import { ReviewService } from '../services/review.service.js';
import { ReviewController } from '../controllers/review.controller.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { requireRoles } from '../middlewares/requirer-roles.middleware.js';

const reviewRouter = express.Router();

const reviewRepository = new ReviewRepository(prisma);
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService);

// 리뷰 작성 API
reviewRouter.post('/', requireAccessToken, requireRoles(['CUSTOMER']), reviewController.createReview);

// 리뷰 목록 조회 API
reviewRouter.get('/', reviewController.getReviewList);

// 내가 작성한 리뷰 목록 조회 API
reviewRouter.get('/my', requireAccessToken, requireRoles(['CUSTOMER']), reviewController.getMyReviewList);

// 리뷰 상세 조회 API
reviewRouter.get('/:reviewId', reviewController.getReviewDetail);

// 리뷰 수정 API
reviewRouter.patch('/:reviewId', requireAccessToken, requireRoles(['CUSTOMER']), reviewController.updateReview);

// 리뷰 삭제 API
reviewRouter.delete('/:reviewId', requireAccessToken, requireRoles(['CUSTOMER']), reviewController.deleteReview);

export { reviewRouter };
