import express from 'express';
import { reviewController } from '../di/dependency-injected-instances.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { createReviewValidator } from '../middlewares/validators/create-review-validator.middleware.js';
import { updateReviewValidator } from '../middlewares/validators/update-review-validator.middleware.js';

const reviewRouter = express.Router();

// 리뷰 작성 API
reviewRouter.post('/', requireAccessToken, requireRoles(['CUSTOMER']), createReviewValidator, reviewController.create);

// 리뷰 목록 조회 API
reviewRouter.get('/stores/:storeId', reviewController.readList);

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
