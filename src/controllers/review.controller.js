import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
  }
  // 리뷰 작성
  create = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { storeId, orderId, rating, content, image } = req.body;
      const createdReview = await this.reviewService.create(userId, storeId, orderId, rating, content, image);

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.REVIEWS.CREATE.SUCCEED,
        data: createdReview,
      });
    } catch (error) {
      next(error);
    }
  };

  // 리뷰 목록 조회
  readList = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const { menuId, orderBy, sort } = req.query;
      const reviews = await this.reviewService.readList(storeId, menuId, orderBy, sort);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.REVIEWS.READ_LIST.SUCCEED,
        data: reviews,
      });
    } catch (error) {
      next(error);
    }
  };

  // 내가 작성한 리뷰 목록 조회
  readMyList = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const myReviews = await this.reviewService.readListByUserId(userId);

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
  readDetail = async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const review = await this.reviewService.readDetail(reviewId);

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
  update = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { reviewId } = req.params;
      const { rating, content, image } = req.body;
      const updatedReview = await this.reviewService.update(userId, reviewId, rating, content, image);

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
  delete = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { reviewId } = req.params;
      await this.reviewService.delete(userId, reviewId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.REVIEWS.DELETE.SUCCEED,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ReviewController;
