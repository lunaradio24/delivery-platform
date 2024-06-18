import express from 'express';
import { prisma } from '../utils/prisma.util';
import { ReviewRepository } from '../repositories/review.repository.js';
import { OrderRepository } from '../repositories/order.repository.js';
import { OrderItemRepository } from '../repositories/order-item.repository.js';
import { StoreRepository } from '../repositories/store.repository.js';
import { MenuRepository } from '../repositories/menu.repository.js';
import { ReviewService } from '../services/review.service.js';
import { ReviewController } from '../controllers/review.controller.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { requireRoles } from '../middlewares/requirer-roles.middleware.js';
import { createReviewValidator } from '../middlewares/validators/create-review-validator.middleware.js';
import { updateReviewValidator } from '../middlewares/validators/update-review-validator.middleware.js';

const reviewRouter = express.Router();

const reviewRepository = new ReviewRepository(prisma);
const orderRepository = new OrderRepository(prisma);
const orderItemRepository = new OrderItemRepository(prisma);
const storeRepository = new StoreRepository(prisma);
const menuRepository = new MenuRepository(prisma);
const reviewService = new ReviewService(
  reviewRepository,
  orderRepository,
  orderItemRepository,
  storeRepository,
  menuRepository,
);
const reviewController = new ReviewController(reviewService);

// 리뷰 작성 API
reviewRouter.post('/', requireAccessToken, requireRoles(['CUSTOMER']), createReviewValidator, reviewController.create);

// 리뷰 목록 조회 API
reviewRouter.get('/', reviewController.readList);

// 내가 작성한 리뷰 목록 조회 API
reviewRouter.get('/my', requireAccessToken, requireRoles(['CUSTOMER']), reviewController.readMyList);

// 리뷰 상세 조회 API
reviewRouter.get('/:reviewId', reviewController.readDetail);

// 리뷰 수정 API
reviewRouter.patch(
  '/:reviewId',
  requireAccessToken,
  requireRoles(['CUSTOMER']),
  updateReviewValidator,
  reviewController.update,
);

// 리뷰 삭제 API
reviewRouter.delete('/:reviewId', requireAccessToken, requireRoles(['CUSTOMER']), reviewController.delete);

export { reviewRouter };
