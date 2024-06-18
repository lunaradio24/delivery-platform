import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
  }

  // 리뷰 작성
  createReview = async (req, res, next) => {
    try {
      const { storeId, orderId, rating, content, image } = req.body;
      const createdReview = await this.reviewService(storeId, orderId, rating, content, image);

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.REVIEWS.CREATED.SUCCEED,
        data: createdReview,
      });
    } catch (error) {
      next(error);
    }
  };

  // 리뷰 목록 조회
  getReviewList = async (req, res, next) => {
    try {
      const { storeId, menuId, sort, filter } = req.query;
      const reviewList = await this.reviewService(storeId, menuId, sort, filter);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.REVIEWS.READ_LIST.SUCCEED,
        data: reviewList,
      });
    } catch (error) {
      next(error);
    }
  };

  // 내가 작성한 리뷰 목록 조회
  getMyReviewList = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const myReviews = await this.reviewService(userId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.REVIEWS.READ_MY.SUCCEED,
        data: myReviews,
      });
    } catch (error) {
      next(error);
    }
  };

  // 리뷰 상세 조회
  getReviewDetail = async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const review = await this.reviewService(reviewId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.REVIEWS.READ_DETAIL.SUCCEED,
        data: review,
      });
    } catch (error) {
      next(error);
    }
  };

  // 리뷰 수정
  updateReview = async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { rating, content, image } = req.body;
      const updatedReview = await this.reviewService(reviewId, rating, content, image);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.REVIEWS.UPDATE.SUCCEED,
        data: updatedReview,
      });
    } catch (error) {
      next(error);
    }
  };

  // 리뷰 삭제
  deleteReview = async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      await this.reviewService(reviewId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.REVIEWS.DELETE.SUCCEED,
      });
    } catch (error) {
      next(error);
    }
  };
}
